"""
URL configuration for django_admin project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import HttpResponse
from django.views.static import serve as static_serve


def home(request):
    return HttpResponse("<h1>Добро пожаловать в СТАРТЛАБ</h1><p><a href='/admin-parol/'>Перейти в админку</a></p>")



urlpatterns = [
    path('', home, name='home'),
    path('admin-parol/', admin.site.urls),
    path('summernote/', include('django_summernote.urls')),
]

# Serve static and media files
# In DEBUG Django's helper adds routes; in production add explicit handlers
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if not settings.DEBUG:
    urlpatterns += [
        path('media/<path:path>', static_serve, {'document_root': settings.MEDIA_ROOT}),
        path('static/<path:path>', static_serve, {'document_root': settings.STATIC_ROOT}),
    ]

# Customize admin site
admin.site.site_header = "СТАРТЛАБ Админка"
admin.site.site_title = "Панель администратора"
admin.site.index_title = "Добро пожаловать в админку СТАРТЛАБ"



