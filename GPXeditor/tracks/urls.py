from django.urls import path
from .views import FileUploadView, FileDetailView

urlpatterns = [
    path('upload/', FileUploadView.as_view()),
    path('upload/<int:pk>', FileDetailView.as_view())
]
