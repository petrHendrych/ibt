from django.contrib import admin
from django.contrib.gis import admin as geoadmin

from .models import GPXTrack, GPXFile

geoadmin.site.register(GPXTrack, geoadmin.OSMGeoAdmin)
admin.site.register(GPXFile)
