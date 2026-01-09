"""
Serializers for the XMP Portfolio backend.
Converts model instances to JSON for the API.
"""
from rest_framework import serializers
from .models import Category, Video, Photo, ContactMessage, Brand, Testimonial, BlogPost, LiveStream, TeamMember, PricingPlan, NewsletterSubscriber

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    """Serializer for the NewsletterSubscriber model."""
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    """Serializer for the Brand model."""
    class Meta:
        model = Brand
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    """Serializer for the Category model."""
    class Meta:
        model = Category
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    """Serializer for the TeamMember model."""
    class Meta:
        model = TeamMember
        fields = '__all__'

class VideoSerializer(serializers.ModelSerializer):
    """
    Serializer for the Video model.
    Includes nested category data for read operations and category_id for write operations.
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Video
        fields = '__all__'

class PhotoSerializer(serializers.ModelSerializer):
    """
    Serializer for the Photo model.
    Includes nested category data for read operations and category_id for write operations.
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)

    class Meta:
        model = Photo
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for the ContactMessage model."""
    class Meta:
        model = ContactMessage
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    """Serializer for the Testimonial model."""
    class Meta:
        model = Testimonial
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for the BlogPost model."""
    class Meta:
        model = BlogPost
        fields = '__all__'

class LiveStreamSerializer(serializers.ModelSerializer):
    """Serializer for the LiveStream model."""
    class Meta:
        model = LiveStream
        fields = '__all__'

class PricingPlanSerializer(serializers.ModelSerializer):
    """Serializer for the PricingPlan model."""
    features_list = serializers.ReadOnlyField()

    class Meta:
        model = PricingPlan
        fields = '__all__'
