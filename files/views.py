from django.shortcuts import render_to_response
from django.core.urlresolvers import reverse
from django.views.generic.edit import CreateView
from django.views.generic.detail import DetailView
from django.http import JsonResponse
from django.template.context_processors import csrf
from .models import DXFFile
from .tasks import calc_length

class DXFFileCreate(CreateView):
    model = DXFFile
    fields = ['file']

    def form_valid(self, form):
        success_url = super(DXFFileCreate, self).form_valid(form)
        calc_length.delay(self.object)
        return JsonResponse({'result_url': success_url.url})

    def get_success_url(self):
        return reverse('files:dxf_detail', kwargs={'pk': self.object.id})


class DXFFileDetail(DetailView):
    model = DXFFile

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return JsonResponse({'length': self.object.length})

def index(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('files/index.html', c)
