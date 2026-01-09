"""
Models for the XMP Portfolio backend.
Defines the data structure for categories, videos, photos, testimonials, and more.
"""
from django.db import models

class Category(models.Model):
    """
    Model representing content categories (e.g., Wedding, Corporate, Music Video).
    Used to organize both videos and photos.
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Video(models.Model):
    """
    Model representing a video project in the portfolio.
    Supports YouTube/Vimeo URLs and featured status for the home page.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_url = models.URLField(help_text="YouTube or Vimeo URL")
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='videos')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Photo(models.Model):
    """
    Model representing a photo project or gallery item.
    """
    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to='photos/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='photos')
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class ContactMessage(models.Model):
    """
    Model to store messages sent via the website's contact form.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    response_content = models.TextField(blank=True, null=True)
    responded_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.name}: {self.subject}"

class NewsletterSubscriber(models.Model):
    """
    Model for managing newsletter subscriptions.
    """
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class Brand(models.Model):
    """
    Model representing partner brands or clients for the marquee section.
    """
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='brands/')
    website_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class Testimonial(models.Model):
    """
    Model for client testimonials displayed on the home page.
    """
    client_name = models.CharField(max_length=100)
    client_role = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    client_image = models.ImageField(upload_to='testimonials/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback from {self.client_name}"

class BlogPost(models.Model):
    """
    Model for blog articles.
    """
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    content = models.TextField()
    featured_image = models.ImageField(upload_to='blog/')
    author_name = models.CharField(max_length=100, default='XMP Team')
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class LiveStream(models.Model):
    """
    Model to manage live broadcast status and details.
    """
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    stream_url = models.URLField(help_text="YouTube Live or Vimeo Live URL")
    is_live = models.BooleanField(default=False)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class TeamMember(models.Model):
    """
    Model representing team members for the About page.
    """
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    image = models.ImageField(upload_to='team/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.name
class PricingPlan(models.Model):
    """
    Model for managing service pricing plans dynamically.
    """
    SERVICE_CHOICES = [
        ('video', 'Video Production'),
        ('photo', 'Photography'),
        ('web', 'Web Developing'),
        ('edit', 'Video Editing'),
        ('audio', 'Audio Production'),
        ('live', 'Live Streaming'),
        ('brand', 'Branding'),
        ('marketing', 'Digital Marketing'),
    ]

    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    plan_name = models.CharField(max_length=100)
    price = models.CharField(max_length=50, help_text="Price as a string (e.g., '350' or 'Custom')")
    features = models.TextField(help_text="Newline-separated list of features")
    is_popular = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['service_type', 'order', 'created_at']

    def __str__(self):
        return f"{self.get_service_type_display()} - {self.plan_name}"

    @property
    def features_list(self):
        return [f.strip() for f in self.features.split('\n') if f.strip()]
