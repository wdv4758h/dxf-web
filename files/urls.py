from django.conf.urls import patterns, url
from .views import DXFFileCreate, DXFFileDetail, DXFFileNurbs, index, price

urlpatterns = patterns('',
    url(r'^$', DXFFileCreate.as_view(), name='dxf_create'),
    url(r'^view/(?P<pk>\d+)/$', DXFFileDetail.as_view(), name='dxf_detail'),
    url(r'^view/(?P<pk>\d+)/nurbs$', DXFFileNurbs.as_view(), name='dxf_nurbs'),
    url(r'^price$', price, name='dxf_price'),
)
