import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xmp_backend.settings')
django.setup()

from rest_framework.test import APIClient
from portfolio.models import BlogPost
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
import io
from PIL import Image

user = User.objects.filter(is_superuser=True).first()
if not user:
    user = User.objects.create_superuser('test_admin', 'admin@example.com', 'admin123')

client = APIClient()
client.force_authenticate(user=user)

blog = BlogPost.objects.first()
if not blog:
    blog = BlogPost.objects.create(title="Test", content="Test", author_name="Admin", is_published=True)

img = Image.new('RGB', (100, 100), color = 'red')
img_io = io.BytesIO()
img.save(img_io, format='JPEG')
img_content = img_io.getvalue()

image_file = SimpleUploadedFile("test_image.jpg", img_content, content_type="image/jpeg")
url = f"/api/blog/{blog.slug}/"
data = {
    "title": "Updated Title",
    "content": "Updated content",
    "author_name": "Admin",
    "is_published": "true",
    "featured_image": image_file
}

res = client.patch(url, data, format='multipart')
print("Status:", res.status_code)
print("Data:", res.data)
