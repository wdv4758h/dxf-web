from django.db import models

class DXFFile(models.Model):
    dxf_file      = models.FileField(default="")

    # DXF to NURBS data
    nurbs         = models.TextField(default="")
    nurbs_finish  = models.BooleanField(default=False)

    # Total Length
    length        = models.FloatField(default=42, blank=True)
    length_finish = models.BooleanField(default=False)
