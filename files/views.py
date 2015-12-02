from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.views.generic.edit import CreateView
from django.views.generic.detail import DetailView
from .models import DXFFile
from .tasks import calc_length

class DXFFileCreate(CreateView):
    model = DXFFile
    fields = ['file']


    def form_valid(self, form):
        original_result = super(DXFFileCreate, self).form_valid(form)    # redirection HTML
        calc_length.delay(self.object)
        return original_result

    def get_success_url(self):
        return reverse('dxf_detail', kwargs={'pk': self.object.id})


class DXFFileDetail(DetailView):
    model = DXFFile

def index(request):
    return render_to_response('files/index.html')
