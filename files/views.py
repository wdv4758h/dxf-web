from math import ceil
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
    fields = ['dxf_file']

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
        return JsonResponse({'finish': self.object.length_finish, 'length': self.object.length})


class DXFFileNurbs(DetailView):
    model = DXFFile

    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        nurbs = self.object.nurbs

        data = []
        datum = dict()

        for i in nurbs.split('\n'):
            if i in ['SPLINE']:
                if datum:
                    data.append(datum)
                datum = dict()
                datum['type'] = i
            elif i.startswith('ctrlp'):
                datum['ctrlp'] = datum.get('ctrlp', []) + [[float(i) for i in i.split()[1:]]]
            elif i.startswith('knot'):
                datum['knot'] = datum.get('knot', []) + [float(i.split()[1])]

        if datum:
            data.append(datum)

        return JsonResponse({'finish': self.object.nurbs_finish, 'data': data})


def index(request):
    c = {}
    c.update(csrf(request))
    return render_to_response('files/index.html', c)


elements_price = {
    'acrylic': {
        'thick': { # mm
            2:    0.03,
            2.5:  0.035,
            3:    0.043,
            4:    0.058,
            4.76: 0.069,
            5:    0.072,
            6:    0.086,
            8:    0.113,
            10:   0.142,
            12:   0.180,
            15:   0.232,
            20:   0.320,
            25:   0.400,
            30:   0.463,
        },
        'cutting_speed': { # mm/second
            1:  100,
            2:  60,
            3:  25,
            5:  12,
            8:  5,
            10: 4,
            12: 3,
            12: 2,
            15: 1,
        },
        'cutting_price': { # second/price
            3:  2,
            5:  4,
            8:  8,
            15: 12,
            20: 17,
        },
    },
}


def price(request):
    post = request.POST
    if post:
        dimension = float(post.get('dimension', 0))
        length    = float(post.get('length', 0))
        material  = post.get('material', '')
        thick     = float(post.get('sheetThickness', ''))
        process   = post.get('process', '')

        material_price = elements_price.get(material, '')

        if not all((dimension, length, material, thick, process, material_price)):
            return JsonResponse({'price': 0})

        sheet_price    = material_price['thick'].get(thick, 0)
        cutting_price  = material_price['cutting_price'].get(thick, 0)
        speed          = material_price['cutting_speed'].get(thick, 0)

        if sheet_price and not cutting_price:
            prices = material_price['cutting_price'].keys()
            low, high = prices[0], prices[-1]
            for i in prices:
                if thick > i > low:
                    low = i
                if high > i > thick:
                    high = i
            cutting_price = ((high - thick)/(high - low) * material_price['cutting_price'][low] + 
                             (thick - low)/(high - low) * material_price['cutting_price'][high])
            cutting_price = ceil(cutting_price)

        if sheet_price and not speed:
            speed = material_price['cutting_speed'].get(ceil(thick), 0)

        price = ceil(dimension * sheet_price) + ceil(length / speed / cutting_price)

        return JsonResponse({'price': price})

    return JsonResponse({'price': 0})
