# Generated by Django 3.0 on 2020-02-24 18:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tracks', '0008_auto_20200219_1915'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gpxtrack',
            name='gpx_file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tracks.GPXFile'),
        ),
    ]
