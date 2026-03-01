"""
URL configuration for xmp_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from django.http import HttpResponse
from django.urls import re_path
from django.views.static import serve

def home_view(request):
    return HttpResponse("XMP Backend API is running successfully!", content_type="text/plain")

def media_debug(request):
    import os
    from django.conf import settings
    media_root = settings.MEDIA_ROOT
    if not os.path.exists(media_root):
        return HttpResponse(f"Media root does not exist: {media_root}")
    files = []
    for root, dirs, filenames in os.walk(media_root):
        for filename in filenames:
            files.append(os.path.relpath(os.path.join(root, filename), media_root))
    return HttpResponse("\n".join(files) if files else "Media root is empty", content_type="text/plain")

urlpatterns = [
    path('', home_view, name='home'),
    path('debug-media/', media_debug),
    path('admin/', admin.site.urls),
    path('api/', include('portfolio.urls')),
    path('api/api-token-auth/', obtain_auth_token, name='api_token_auth'),
    # Force Django to serve media files in production on Render
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
