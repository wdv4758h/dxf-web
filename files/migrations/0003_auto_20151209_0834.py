# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-09 08:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('files', '0002_dxffile_length'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dxffile',
            name='file',
        ),
        migrations.AddField(
            model_name='dxffile',
            name='dxf_file',
            field=models.FileField(default=b'', upload_to=b''),
        ),
        migrations.AddField(
            model_name='dxffile',
            name='length_finish',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='dxffile',
            name='nurbs',
            field=models.TextField(default=b''),
        ),
        migrations.AddField(
            model_name='dxffile',
            name='nurbs_finish',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='dxffile',
            name='length',
            field=models.FloatField(blank=True, default=42),
        ),
    ]