import os
import requests
from django.core.files.storage import Storage
from django.conf import settings
from django.utils.deconstruct import deconstructible

@deconstructible
class ImageKitStorage(Storage):
    def _save(self, name, content):
        file_content = content.read()
        url = "https://upload.imagekit.io/api/v1/files/upload"
        private_key = getattr(settings, 'IMAGEKIT_PRIVATE_KEY', '')
        
        if not private_key:
            raise Exception("IMAGEKIT_PRIVATE_KEY is not set. Please set it in your environment variables.")
            
        files = {
            'file': (os.path.basename(name), file_content),
        }
        data = {
            'fileName': os.path.basename(name),
            'useUniqueFileName': 'true',
            'folder': getattr(settings, 'IMAGEKIT_FOLDER', '/xmp')
        }
        
        response = requests.post(url, auth=(private_key, ''), files=files, data=data)
        
        if response.status_code in [200, 201]:
            resp_data = response.json()
            return resp_data['filePath']
        else:
            raise Exception(f"ImageKit Upload Failed: {response.status_code} - {response.text}")

    def url(self, name):
        if name.startswith('http'):
            return name
        endpoint = getattr(settings, 'IMAGEKIT_URL_ENDPOINT', '').rstrip('/')
        if not endpoint:
            # Fallback if endpoint not configured
            return f"/media/{name.lstrip('/')}"
        return f"{endpoint}/{name.lstrip('/')}"

    def exists(self, name):
        return False

    def size(self, name):
        return 0

    def get_available_name(self, name, max_length=None):
        return name
