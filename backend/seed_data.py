import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xmp_backend.settings')
django.setup()

from portfolio.models import Category

def seed():
    categories = ['Wedding', 'Corporate', 'Event', 'Music']
    for name in categories:
        slug = name.lower()
        obj, created = Category.objects.get_or_create(name=name, slug=slug)
        if created:
            print(f"Created category: {name}")
        else:
            print(f"Category already exists: {name}")
    
    print(f"Total categories: {Category.objects.count()}")

if __name__ == '__main__':
    seed()
