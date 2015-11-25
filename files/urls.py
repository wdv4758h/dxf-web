from django.conf.urls import patterns, url
from .views import DXFFileCreate, DXFFileDetail

urlpatterns = patterns('',
    url(r'^$', DXFFileCreate.as_view(), name='dxf_create'),
    url(r'^view/(\d+)/$', DXFFileDetail.as_view(), name='dxf_detail'),
)
