from rest_framework import routers
from .api import GPXTrackViewSet


router = routers.DefaultRouter()
router.register('api/tracks', GPXTrackViewSet, 'tracks')

urlpatterns = router.urls
