from django.db import models

class DXFFile(models.Model):
    file = models.FileField()
    length = models.FloatField(default=0, blank=True)
    finish = models.BooleanField(default=False)
