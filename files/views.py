from django.views.generic.edit import CreateView
from .models import DXFFile
from .tasks import calc_length

class DXFFileCreate(CreateView):
    model = DXFFile
    fields = ['file']
    success_url = '/test'    # FIXME


    def form_valid(self, form):
        original_result = super(DXFFileCreate, self).form_valid(form)
        print('=' * 20)
        length = calc_length(self.object.file)
        print('total length is: {}'.format(length))
        print('=' * 20)
        return original_result
