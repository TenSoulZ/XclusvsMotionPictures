"""
API ViewSets for the XMP Portfolio backend.
Handles the logic for CRUD operations and custom actions like newsletter broadcasts.
"""
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Video, Photo, ContactMessage, Brand, Testimonial, BlogPost, LiveStream, TeamMember, PricingPlan, NewsletterSubscriber
from .serializers import CategorySerializer, VideoSerializer, PhotoSerializer, ContactMessageSerializer, BrandSerializer, TestimonialSerializer, BlogPostSerializer, LiveStreamSerializer, TeamMemberSerializer, PricingPlanSerializer, NewsletterSubscriberSerializer

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling contact form submissions.
    Allows anyone to 'create' a message, but only authenticated users to list or retrieve messages.
    Automatically sends an email notification upon successful message creation.
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        """
        Custom create logic to trigger an email notification.
        """
        instance = serializer.save()
        from .utils import send_contact_notification
        send_contact_notification(instance)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def respond(self, request, pk=None):
        """
        Action to send a direct response to a contact message.
        Expects 'response_content' in the post data.
        """
        instance = self.get_object()
        response_content = request.data.get('response_content')
        
        if not response_content:
            return Response({"error": "Response content is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        from .utils import send_admin_response
        if send_admin_response(instance, response_content):
            return Response({"status": "Response sent successfully!"})
        else:
            return Response({"error": "Failed to send email. Please check server settings."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing newsletter subscribers.
    """
    queryset = NewsletterSubscriber.objects.all().order_by('-created_at')
    serializer_class = NewsletterSubscriberSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def broadcast(self, request):
        """
        Broadcasts a newsletter to all active subscribers.
        """
        subject = request.data.get('subject')
        content = request.data.get('content')
        
        if not subject or not content:
            return Response({"error": "Subject and content are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        subscribers = NewsletterSubscriber.objects.filter(is_active=True)
        recipient_list = [sub.email for sub in subscribers]
        
        if not recipient_list:
            return Response({"status": "No active subscribers to send to."})

        from .utils import broadcast_newsletter
        if broadcast_newsletter(subject, content, recipient_list):
            return Response({"status": f"Successfully sent newsletter to {len(recipient_list)} subscribers."})
        else:
            return Response({"error": "Failed to send newsletter."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TeamMemberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing team member information.
    Public access for viewing, authenticated access for modifications.
    """
    queryset = TeamMember.objects.all().order_by('created_at')
    serializer_class = TeamMemberSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing content categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

class VideoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for video projects.
    Supports filtering by category and featured status, and searching by title/description.
    """
    queryset = Video.objects.all().order_by('-created_at')
    serializer_class = VideoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    


class PhotoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for photo projects.
    Supports filtering, searching, and ordering.
    """
    queryset = Photo.objects.all().order_by('-created_at')
    serializer_class = PhotoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet for partner brands.
    """
    queryset = Brand.objects.all().order_by('-created_at')
    serializer_class = BrandSerializer
    pagination_class = None
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class TestimonialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for client testimonials.
    """
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer
    pagination_class = None
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class BlogPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for blog posts.
    Uses 'slug' for lookups instead of ID.
    Unauthenticated users can only see 'is_published=True' posts.
    """
    queryset = BlogPost.objects.all().order_by('-created_at')
    serializer_class = BlogPostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_published']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'title']
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = BlogPost.objects.all().order_by('-created_at')
        if self.action in ['list', 'retrieve'] and not self.request.user.is_authenticated:
            queryset = queryset.filter(is_published=True)
        return queryset

class LiveStreamViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing live stream entries.
    """
    queryset = LiveStream.objects.all().order_by('-created_at')
    serializer_class = LiveStreamSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class PricingPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing pricing plans.
    """
    queryset = PricingPlan.objects.all().order_by('service_type', 'order')
    serializer_class = PricingPlanSerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
