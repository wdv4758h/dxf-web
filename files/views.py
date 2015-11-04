from django.views.generic.edit import CreateView
from .models import DXFFile

class DXFFileCreate(CreateView):
    model = DXFFile
    fields = ['file']
