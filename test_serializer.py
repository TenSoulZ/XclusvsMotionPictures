import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xmp_backend.settings')
django.setup()

from portfolio.serializers import BlogPostSerializer
from portfolio.models import BlogPost
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image

img = Image.new('RGB', (100, 100), color = 'red')
img_io = io.BytesIO()
img.save(img_io, format='JPEG')
img_content = img_io.getvalue()

image_file = SimpleUploadedFile("test_image.jpg", img_content, content_type="image/jpeg")

data = {
    'title': 'Test Blog ImageKit',
    'content': 'This is a test',
    'author_name': 'Test Admin',
    'is_published': True
}

data['featured_image'] = image_file

serializer = BlogPostSerializer(data=data)
if serializer.is_valid():
    print("Serializer is valid!")
    try:
        blog = serializer.save()
        print("Saved successfully! Image name:", blog.featured_image.name)
        blog.delete() # cleanup
    except Exception as e:
        print("Save failed with exception:", str(e))
else:
    print("Serializer errors:", serializer.errors)
