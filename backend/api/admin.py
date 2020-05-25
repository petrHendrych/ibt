"""Admin page setup

Next to normal admin adding geoadmin for gis support
"""

from django.contrib import admin
from django.contrib.gis import admin as geoadmin

from .models import GPXTrack, GPXFile

__author__ = 'Petr Hendrych'
__email__ = 'xhendr03@fit.vutbr.cz'

geoadmin.site.register(GPXTrack, geoadmin.OSMGeoAdmin)
admin.site.register(GPXFile)
