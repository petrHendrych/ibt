from django.conf import settings
from django.contrib.gis.geos import Point, MultiLineString, LineString
from rest_framework.generics import ListCreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status

from .models import GPXFile, GPXTrack
from .serializers import FileSerializer, TrackSerializer

import gpxpy
import gpxpy.gpx


# function for parsing and saving data from gpx file to our database
# function is called after the gpx_file is uploaded

class FileUploadView(ListCreateAPIView):
    queryset = GPXFile.objects.all()
    serializer_class = FileSerializer

    parser_class = (FileSerializer,)

    def post(self, request, *args, **kwargs):
        file_serializer = FileSerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            file_instance = GPXFile.objects.last()
            save_gpx_to_database(request.FILES['gpx_file'], file_instance)
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def save_gpx_to_database(f, file_instance):
    gpx_file = open(settings.MEDIA_ROOT + '/uploaded_gpx_files'+'/' + f.name)
    gpx = gpxpy.parse(gpx_file)

    if gpx.tracks:
        for track in gpx.tracks:
            new_track = GPXTrack()

            for segment in track.segments:
                track_list_of_points = []
                for point in segment.points:

                    point_in_segment = Point(point.latitude, point.longitude)
                    track_list_of_points.append(point_in_segment.coords)

                # TODO check if track has at least 2 points
                new_track_segment = LineString(track_list_of_points)

            new_track.track = MultiLineString(new_track_segment)
            new_track.gpx_file = file_instance
            new_track.save()


class FileDetailView(RetrieveUpdateDestroyAPIView):
    queryset = GPXFile.objects.all()
    serializer_class = FileSerializer
