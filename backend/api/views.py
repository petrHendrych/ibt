"""API views providing responses to api requests

Definition of logic after receiving requests to API endpoints
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from django.conf import settings
from django.contrib.gis.geos import Point, LineString, Polygon

from . import serializers, models
from api.exceptions import EmptyTracks, InvalidFileFormat

import gpxpy
import gpxpy.gpx

from yattag import Doc, indent
import datetime
import re

__author__ = 'Petr Hendrych'
__email__ = 'xhendr03@fit.vutbr.cz'


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FileSerializer
    queryset = models.GPXFile.objects.all()
    permission_classes = (IsAuthenticated, IsAuthenticatedOrReadOnly)
    ordering = ('id',)
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        user = self.request.user
        return models.GPXFile.objects.filter(owner=user)

    def perform_create(self, serializer: serializers.FileSerializer):
        file_serializer = serializers.FileSerializer(data=self.request.data)

        if file_serializer.is_valid():
            serializer.save(owner=self.request.user)
            file_instance = models.GPXFile.objects.last()

            try:
                create_track_instances(self.request.FILES['gpx_file'], file_instance)
            except EmptyTracks:
                raise InvalidFileFormat

    def perform_destroy(self, instance: models.GPXFile):
        if self.get_object().owner == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied(detail='You do not have permission to DELETE file.')


def create_track_instances(f, file_instance):
    """
    Function to parse GPX file, create new GPXtrack instances and save to database.
    Using gpxpy package.

    :param f: file path
    :param file_instance: file orm instance
    :return:
    """
    f.name = re.sub('[()]', '', f.name)
    gpx_file = open(settings.MEDIA_ROOT + '/uploaded_gpx_files'+'/' + f.name.replace(" ", "_"), encoding='utf-8-sig')
    gpx = gpxpy.parse(gpx_file)

    if gpx.tracks:
        invalid_tracks = False

        for idx, track in enumerate(gpx.tracks):
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
                    if len(tracks_elevations) > 0:
                        tracks_elevations.append(tracks_elevations[0])
                    if len(tracks_times) > 0:
                        tracks_times.append(tracks_times[0])

            if len(track_list_of_points) == 0:
                invalid_tracks = True
                continue

            new_track.track = LineString(track_list_of_points)
            new_track.gpx_file = file_instance
            if track.name:
                new_track.name = track.name
            new_track.elevations = tracks_elevations
            new_track.times = tracks_times
            new_track.save()

        if invalid_tracks:
            raise EmptyTracks


class TrackViewSet(viewsets.ModelViewSet):
    queryset = models.GPXTrack.objects.all()
    permission_classes = (IsAuthenticated,)
    ordering = ('id',)
    http_method_names = ['get', 'put', 'head', 'post', 'delete']

    def get_queryset(self):
        files = models.GPXFile.objects.filter(owner=self.request.user)
        result = []
        for track in files:
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
        file = models.GPXFile.objects.get(id=trk.gpx_file.id)

        if file.owner != request.user:
            raise PermissionDenied(detail='You do not have permission to get partition of this track.')

        bounds = request.data['bounds']
        bbox = (bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1])

        poly = Polygon.from_bbox(bbox)
        prep_poly = poly.prepared  # creating prepared geometry to speed up comparisons

        indexes = []

        track_list = list(trk.track)
        for idx, (lat, lng) in enumerate(track_list):
            point = Point(lat, lng)
            if prep_poly.contains(point):
                indexes.append(idx)

        return Response({
            'indexes': indexes
        })

    @action(methods=['get'], detail=True)
    def download(self, request, pk=None):
        trk = models.GPXTrack.objects.get(id=pk)
        file = models.GPXFile.objects.get(id=trk.gpx_file.id)

        if file.owner != request.user:
            raise PermissionDenied(detail='You do not have permission to download this track.')

        doc, tag, text = Doc().tagtext()
        mail = request.user.email.split('@')

        # creating GPX file
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
                    doc.stag('email', id="{}".format(mail[0]), domain="{}".format(mail[1]))
                with tag('time'):
                    text("{}".format(datetime.datetime.now().astimezone().replace(microsecond=0).isoformat()))
            with tag('trk'):
                with tag('name'):
                    text("{}".format(trk.name))
                with tag('trkseg'):
                    for idx, (lat, lon) in enumerate(trk.track):
                        with tag('trkpt', lat="{}".format(lat), lon="{}".format(lon)):
                            if trk.elevations:
                                with tag('ele'):
                                    text("{}".format(trk.elevations[idx]))
                            if trk.times:
                                with tag('time'):
                                    text("{}".format(trk.times[idx]))

        result_xml = indent(
            doc.getvalue(),
            indentation=' ' * 2,
            newline='\r\n'
        )

        return Response(result_xml, content_type="text/gpx+xml")
