from rest_framework import routers
from django.urls import path
from .views import FileUploadView, FileDetailView
# from .api import GPXTrackViewSet


# router = routers.DefaultRouter()
# router.register('api/tracks', GPXTrackViewSet, 'tracks')
#
# urlpatterns = router.urls

urlpatterns = [
    path('upload/', FileUploadView.as_view()),
    path('upload/<int:pk>', FileDetailView.as_view())
]
