from tracks.models import GPXTrack
from rest_framework import viewsets, permissions
from .serializers import TrackSerializer


class GPXTrackViewSet(viewsets.ModelViewSet):
    permissions_classes = [
        permissions.AllowAny
    ]

    serializer_class = TrackSerializer

    def get_queryset(self):
        return self.request.user.track.all()

    def perform_create(self, serializer: TrackSerializer):
        serializer.save(owner=self.request.user)



