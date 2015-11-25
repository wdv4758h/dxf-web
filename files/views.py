from django.shortcuts import render_to_response
from django.views.generic.edit import CreateView
from django.views.generic.detail import DetailView
from .models import DXFFile
from .tasks import calc_length

class DXFFileCreate(CreateView):
    model = DXFFile
    fields = ['file']
    success_url = '/test'    # FIXME


    def form_valid(self, form):
        original_result = super(DXFFileCreate, self).form_valid(form)    # redirection HTML
        calc_length.delay(self.object)
        return original_result


class DXFFileDetail(DetailView):
    model = DXFFile
