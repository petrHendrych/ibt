from django.contrib.gis.db import models
from django.db.models import Manager as GeoManager
from django.contrib.auth.models import User


def gpx_folder(instance, filename):
    return "uploaded_gpx_files/%s" % filename


class gpxFile(models.Model):
    title = models.CharField("Title", max_length=100)
    gpx_file = models.FileField(upload_to=gpx_folder, blank=True)

    def __unicode__(self):
        return self.title


class GPXTrack(models.Model):
    track = models.MultiLineStringField()
    gpx_file = models.ForeignKey(gpxFile, on_delete=models.CASCADE)
    owner = models.ForeignKey(User, related_name="track", on_delete=models.CASCADE, null=True)
    objects = GeoManager()
