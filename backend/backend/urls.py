"""Main URL Configuration

Defining end points with included apps URLs
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, re_path

__author__ = 'Petr Hendrych'
__email__ = 'xhendr03@fit.vutbr.cz'


urlpatterns = [
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^api/', include("api.urls")),
    re_path(r'^auth/', include("accounts.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


