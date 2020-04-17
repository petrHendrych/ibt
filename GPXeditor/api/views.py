from rest_framework import viewsets, status, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response


from django.conf import settings
from django.http import JsonResponse, FileResponse
from django.contrib.gis.geos import Point, MultiLineString, LineString, Polygon

from tracks import models
from . import serializers

import gpxpy
import gpxpy.gpx

import xml.etree.ElementTree as ET
import os


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
    gpx_file = open(settings.MEDIA_ROOT + '/uploaded_gpx_files'+'/' + f.name, encoding='utf-8-sig')
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
    def post(self, request, *args, **kwargs):
        with open("testfile.gpx", "w+") as file:
            root = ET.Element("gpx", {
                "version": "1.1",
                "creator": "{}".format(request.user),
                "xmlns": "http://www.topografix.com/GPX/1/1",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
            })

            trk = ET.SubElement(root, "trk")
            ET.SubElement(trk, "name").text = "{}".format(request.data['properties']['name'])
            trk_seg = ET.SubElement(trk, "trkseg")

            for idx, item in enumerate(request.data['geometry']['coordinates'][0]):
                point = ET.SubElement(trk_seg, "trkpt", lat="{}".format(item[0]), lon="{}".format(item[1]))
                if request.data['properties']['elevations']:
                    ET.SubElement(point, "ele").text = "{}".format(request.data['properties']['elevations'][idx])
                if request.data['properties']['times']:
                    ET.SubElement(point, "time").text = "{}".format(request.data['properties']['times'][idx])

            tree = ET.ElementTree(root)
            tree.write("testfile.gpx", xml_declaration=True, encoding="utf-8", method="xml")
            response = FileResponse(open("testfile.gpx", 'rb'), as_attachment=True, content_type="text/gpx+xml")

            return response
