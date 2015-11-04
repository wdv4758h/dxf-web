from django.forms import ModelForm
from .models import DXFFile

class DXFFileForm(ModelForm):
    class Meta:
        model = DXFFile
