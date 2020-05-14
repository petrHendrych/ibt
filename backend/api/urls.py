from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views as api_views


class OptionalSlashRouter(DefaultRouter):
    def __init__(self):
        super().__init__()
        self.trailing_slash = '/?'


router = OptionalSlashRouter()
router.register(r'files', api_views.FileViewSet)
router.register(r'tracks', api_views.TrackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
