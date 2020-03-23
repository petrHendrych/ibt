from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

from django.conf import settings
from django.contrib.gis.geos import Point, MultiLineString, LineString

from tracks import models
from . import serializers

import gpxpy
import gpxpy.gpx


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
    gpx_file = open(settings.MEDIA_ROOT + '/uploaded_gpx_files'+'/' + f.name)
    gpx = gpxpy.parse(gpx_file)

    if gpx.tracks:
        for track in gpx.tracks:
            new_track = models.GPXTrack()

            tracks_elevations = []
            track_list_of_points = []
            tracks_times = []

            for segment in track.segments:
                for point in segment.points:

                    point_in_segment = Point(point.latitude, point.longitude)
                    tracks_elevations.append(point.elevation)
                    tracks_times.append(point.time.isoformat())
                    track_list_of_points.append(point_in_segment.coords)

                # TODO check if track has at least 2 points
                if len(track_list_of_points) == 1:
                    track_list_of_points.append(track_list_of_points[0])
                    
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
