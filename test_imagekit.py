import os
import django
from decouple import config
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xmp_backend.settings')
django.setup()

from django.conf import settings
from xmp_backend.storage import ImageKitStorage
from django.core.files.base import ContentFile

storage = ImageKitStorage()
try:
    name = storage.save('test.txt', ContentFile(b'Hello world'))
    print("Saved:", name)
    print("URL:", storage.url(name))
except Exception as e:
    print("Error:", e)
