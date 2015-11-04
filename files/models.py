from django.db import models

class DXFFile(models.Model):
    file = models.FileField()
