from rest_framework import serializers
from geojson_serializer.serializers import geojson_serializer
from tracks.models import GPXTrack
from tracks.models import GPXFile


@geojson_serializer('track')
class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXTrack
        fields = '__all__'


class TracksSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXTrack
        exclude = ('track', 'elevations', 'times')


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXFile
        fields = "__all__"
