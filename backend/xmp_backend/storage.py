import os
import requests
from django.core.files.storage import Storage
from django.conf import settings
from django.utils.deconstruct import deconstructible

import mimetypes
from django.core.exceptions import ValidationError

@deconstructible
class ImageKitStorage(Storage):
    def _save(self, name, content):
        try:
            # DRF's Image.verify() leaves the file pointer at the end. We must seek to 0.
            if hasattr(content, 'seek'):
                content.seek(0)
            file_content = content.read()
            
            url = "https://upload.imagekit.io/api/v1/files/upload"
            private_key = getattr(settings, 'IMAGEKIT_PRIVATE_KEY', '')
            
            if not private_key:
                raise ValidationError("IMAGEKIT_PRIVATE_KEY is not set. Please set it in your environment variables.")
                
            content_type, _ = mimetypes.guess_type(name)
            files = {
                'file': (os.path.basename(name), file_content, content_type or 'application/octet-stream'),
            }
            
            folder_base = getattr(settings, 'IMAGEKIT_FOLDER', '/xmp')
            folder_path = os.path.dirname(name)
            folder = f"{folder_base}/{folder_path}".rstrip('/') if folder_path else folder_base
            
            data = {
                'fileName': os.path.basename(name),
                'useUniqueFileName': 'true',
                'folder': folder
            }
            
            response = requests.post(url, auth=(private_key, ''), files=files, data=data)
            
            if response.status_code in [200, 201]:
                resp_data = response.json()
                return resp_data['filePath']
            else:
                raise ValidationError(f"ImageKit Upload Failed: {response.status_code} - {response.text}")
        except Exception as e:
            # Catch all exceptions and raise ValidationError so DRF returns a 400 with the error message
            raise ValidationError(f"ImageKit Storage Error: {str(e)}")

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
