"""Simple serializers for request and responses

Create JSONs for responses and transform JSON requests back to ORM.
Track serializers also validate incoming data.
"""

from rest_framework import serializers
from geojson_serializer.serializers import geojson_serializer
from .models import GPXTrack
from .models import GPXFile

__author__ = 'Petr Hendrych'
__email__ = 'xhendr03@fit.vutbr.cz'


@geojson_serializer('track')
class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXTrack
        fields = '__all__'

    @staticmethod
    def validate_track(val):
        for x, y in val:
            if x < -90 or x > 90 or y < -180 or y > 180:
                raise serializers.ValidationError("Track contains invalid coordinates")

        return val


class TracksSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXTrack
        exclude = ('track', 'elevations', 'times')


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPXFile
        fields = "__all__"
