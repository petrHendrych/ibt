from django.contrib.gis.db import models
from django.db.models import Manager as GeoManager
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.core.validators import FileExtensionValidator

import re


def gpx_folder(_, filename):
    filename = re.sub('[()]', '', filename)
    return "uploaded_gpx_files/%s" % filename.replace(" ", "_")


class GPXFile(models.Model):
    title = models.CharField(max_length=100, blank=False)
    owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    gpx_file = models.FileField(upload_to=gpx_folder,
                                blank=True,
                                validators=[FileExtensionValidator(allowed_extensions=['gpx'])]
                                )

    def delete(self, using=None, keep_parents=False):
        self.gpx_file.delete()
        super(GPXFile, self).delete()

    def __unicode__(self):
        return self.title


class GPXTrack(models.Model):
    track = models.LineStringField()
    name = models.CharField(max_length=100, blank=True)
    gpx_file = models.ForeignKey(GPXFile, on_delete=models.CASCADE)
    elevations = ArrayField(models.DecimalField(max_digits=13, decimal_places=3), default=list, blank=True)
    times = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    objects = GeoManager()
