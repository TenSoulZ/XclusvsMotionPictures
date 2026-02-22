import os
import django
import random
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'xmp_backend.settings')
django.setup()

from portfolio.models import Category, Video, BlogPost, TeamMember, PricingPlan
from django.contrib.auth.models import User

def seed():
    print("Seeding data...")

    # Categories
    categories = ['Wedding', 'Corporate', 'Event', 'Music Video', 'Documentary']
    cat_objs = []
    for name in categories:
        slug = name.lower().replace(' ', '-')
        obj, created = Category.objects.get_or_create(name=name, defaults={'slug': slug})
        cat_objs.append(obj)
        if created:
            print(f"Created category: {name}")

    # Superuser
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Created superuser: admin (password: admin123)")
    
    # Team Members
    if not TeamMember.objects.exists():
        TeamMember.objects.create(name='John Doe', role='Lead Videographer')
        TeamMember.objects.create(name='Jane Smith', role='Creative Director')
        print("Created team members")

    # Pricing Plans
    if not PricingPlan.objects.exists():
        PricingPlan.objects.create(
            service_type='video',
            plan_name='Essential Package',
            price='1500',
            features='4 Hours Coverage\nHighlight Reel\nDigital Delivery'
        )
        PricingPlan.objects.create(
            service_type='video',
            plan_name='Premium Package',
            price='2500',
            features='8 Hours Coverage\nFull Film + Highlight\nDrone Footage\nDigital Delivery',
            is_popular=True
        )
        print("Created pricing plans")

    # Blog Posts
    if not BlogPost.objects.exists():
        BlogPost.objects.create(
            title='Why Video Marketing Matters',
            content='In today\'s digital age, video content is king. Here is why you need it...',
            is_published=True
        )
        print("Created sample blog post")

    # Videos (Sample)
    if not Video.objects.exists() and cat_objs:
        Video.objects.create(
            title='Sample Wedding Highlight',
            description='A beautiful day capturing love and joy.',
            video_url='https://www.youtube.com/watch?v=dQw4w9WgXcQ', # Placeholder
            category=cat_objs[0],
            is_featured=True
        )
        print("Created sample video")

    print("Seeding complete.")

if __name__ == '__main__':
    seed()
