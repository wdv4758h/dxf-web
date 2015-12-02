from django.conf.urls import patterns, url
from .views import DXFFileCreate, DXFFileDetail, index

urlpatterns = patterns('',
    url(r'^$', DXFFileCreate.as_view(), name='dxf_create'),
    url(r'^view/(?P<pk>\d+)/$', DXFFileDetail.as_view(), name='dxf_detail'),
)
