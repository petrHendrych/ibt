from rest_framework import serializers
from geojson_serializer.serializers import geojson_serializer
from tracks.models import GPXTrack


@geojson_serializer('track')
class GPXTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXTrack
        fields = '__all__'
