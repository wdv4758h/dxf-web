from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from files.views import DXFFileCreate

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'undergrad.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^test/', DXFFileCreate.as_view()),
)
