from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.contrib.gis.geos import Point, MultiLineString, LineString, Polygon

from tracks import models
from . import serializers

import gpxpy
import gpxpy.gpx

from yattag import Doc, indent
import datetime
import re


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FileSerializer
    queryset = models.GPXFile.objects.all()
    permission_classes = (IsAuthenticated, IsAuthenticatedOrReadOnly)
    ordering = ('id',)

    def get_queryset(self):
        user = self.request.user
        return models.GPXFile.objects.filter(owner=user)

    def perform_create(self, serializer: serializers.FileSerializer):
        file_serializer = serializers.FileSerializer(data=self.request.data)
        if file_serializer.is_valid():
            serializer.save(owner=self.request.user)
            file_instance = models.GPXFile.objects.last()
            save_gpx_to_database(self.request.FILES['gpx_file'], file_instance)

    def perform_destroy(self, instance: models.GPXFile):
        if self.get_object().owner == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied(
                detail='You do not have permission to DELETE file.')


def save_gpx_to_database(f, file_instance):
    f.name = re.sub('[()]', '', f.name)
    gpx_file = open(settings.MEDIA_ROOT + '/uploaded_gpx_files'+'/' + f.name.replace(" ", "_"), encoding='utf-8-sig')
    gpx = gpxpy.parse(gpx_file)

    if gpx.tracks:
        for track in gpx.tracks:
            new_track = models.GPXTrack()

            tracks_elevations = []
            track_list_of_points = []
            tracks_times = []

            for segment in track.segments:
                for point in segment.points:
                    point_in_segment = Point(round(point.latitude, 6), round(point.longitude, 6))
                    track_list_of_points.append(point_in_segment.coords)

                    if point.elevation:
                        tracks_elevations.append(point.elevation)

                    if point.time:
                        tracks_times.append(point.time.isoformat())

                if len(track_list_of_points) == 1:
                    track_list_of_points.append(track_list_of_points[0])
                    tracks_elevations.append(tracks_elevations[0])
                    tracks_times.append(tracks_times[0])
                    
                new_track_segment = LineString(track_list_of_points)
                new_track_segment.srid = 4326

            new_track.track = MultiLineString(new_track_segment)
            new_track.gpx_file = file_instance
            new_track.name = track.name
            new_track.elevations = tracks_elevations
            new_track.times = tracks_times
            new_track.save()


class TrackViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TrackSerializer
    queryset = models.GPXTrack.objects.all()
    permission_classes = (IsAuthenticated,)
    ordering = ('id',)

    def get_queryset(self):
        tracks = models.GPXFile.objects.filter(owner=self.request.user)
        result = []
        for track in tracks:
            result.append(track.id)
        return models.GPXTrack.objects.filter(gpx_file__in=result)

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.TracksSerializer
        else:
            return serializers.TrackSerializer

    @action(methods=['post'], detail=True)
    def partition(self, request, pk=None):
        trk = models.GPXTrack.objects.get(id=pk)
        files = models.GPXFile.objects.filter(owner=request.user)

        if trk.gpx_file not in files:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        bounds = request.data['bounds']
        bbox = (bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1])

        poly = Polygon.from_bbox(bbox)
        prep_poly = poly.prepared

        indexes = []

        track_list = list(trk.track[0])
        for idx, (lat, lng) in enumerate(track_list):
            point = Point(lat, lng)
            if prep_poly.contains(point):
                indexes.append(idx)

        return JsonResponse({
            'indexes': indexes
        })


class DownloadViewSet(generics.GenericAPIView):
    def post(self, request):

        doc, tag, text = Doc().tagtext()

        doc.asis('<?xml version="1.0" encoding="UTF-8" standalone="no" ?>')
        with tag('gpx', ('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance'),
                 ('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance'),
                 ('xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd'),
                 version="1.1", creator="FIT GPX editor",
                 xmlns="http://www.topografix.com/GPX/1/1"):
            with tag('metadata'):
                with tag('author'):
                    with tag('name'):
                        text("{}".format(request.user))
                    with tag('email'):
                        text("{}".format(request.user.email))
                with tag('time'):
                    text("{}".format(datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()))
            with tag('trk'):
                with tag('name'):
                    text("{}".format(request.data['properties']['name']))
                with tag('trkseg'):
                    for idx, item in enumerate(request.data['geometry']['coordinates'][0]):
                        with tag('trkpt', lat="{}".format(item[0]), lon="{}".format(item[1])):
                            if request.data['properties']['elevations']:
                                with tag('ele'):
                                    text("{}".format(request.data['properties']['elevations'][idx]))
                            if request.data['properties']['times']:
                                with tag('time'):
                                    text("{}".format(request.data['properties']['times'][idx]))

        result_xml = indent(
            doc.getvalue(),
            indentation=' ' * 2,
            newline='\r\n'
        )

        return HttpResponse(result_xml, content_type="text/gpx+xml")

