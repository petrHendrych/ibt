from tracks.models import GPXTrack
from rest_framework import viewsets, permissions
from .serializers import GPXTrackSerializer


class GPXTrackViewSet(viewsets.ModelViewSet):
    permissions_classes = [
        permissions.AllowAny
    ]

    serializer_class = GPXTrackSerializer

    def get_queryset(self):
        return self.request.user.track.all()

    def perform_create(self, serializer: GPXTrackSerializer):
        serializer.save(owner=self.request.user)

