"""
API ViewSets for the XMP Portfolio backend.
Handles the logic for CRUD operations and custom actions like newsletter broadcasts.
"""
import logging
from rest_framework import viewsets, permissions, filters, status, views
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Category, Video, Photo, ContactMessage, Brand, Testimonial, BlogPost, LiveStream, TeamMember, PricingPlan, NewsletterSubscriber, Equipment
from .serializers import CategorySerializer, VideoSerializer, PhotoSerializer, ContactMessageSerializer, BrandSerializer, TestimonialSerializer, BlogPostSerializer, LiveStreamSerializer, TeamMemberSerializer, PricingPlanSerializer, NewsletterSubscriberSerializer, EquipmentSerializer
from .permissions import IsAdminOrReadOnly, AllowAnyCreateOrIsAuthenticated, AllowAnyCreateOrIsAdmin

logger = logging.getLogger(__name__)

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling contact form submissions.
    Allows anyone to 'create' a message, but only authenticated users to list or retrieve messages.
    Automatically sends an email notification upon successful message creation.
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAnyCreateOrIsAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'contact'
    
    def perform_create(self, serializer):
        """
        Custom create logic to trigger an email notification.
        """
        instance = serializer.save()
        from .utils import send_contact_notification
        send_contact_notification(instance)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
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
        try:
            if send_admin_response(instance, response_content):
                return Response({"status": "Response sent successfully!"})
            else:
                raise Exception("Email sending failed for an unknown reason")
        except Exception as e:
            logger.error(f"Failed to send email response to {instance.email}: {e}")
            return Response({"error": "Failed to send email. Please check server settings."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NewsletterSubscriberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing newsletter subscribers.
    """
    queryset = NewsletterSubscriber.objects.all().order_by('-created_at')
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [AllowAnyCreateOrIsAdmin]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'newsletter'

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def broadcast(self, request):
        """
        Broadcasts a newsletter to all active subscribers.
        """
        subject = request.data.get('subject')
        content = request.data.get('content')
        
        if not subject or not content:
            return Response({"error": "Subject and content are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        subscribers = NewsletterSubscriber.objects.filter(is_active=True)
        
        if not subscribers.exists():
            return Response({"status": "No active subscribers to send to."})

        from .utils import broadcast_newsletter
        try:
            # Pass full subscriber objects to utils to handle unsubscribe tokens
            if broadcast_newsletter(subject, content, subscribers):
                return Response({"status": f"Successfully sent newsletter to {subscribers.count()} subscribers."})
            else:
                raise Exception("Newsletter broadcast failed for an unknown reason")
        except Exception as e:
            logger.error(f"Failed to broadcast newsletter: {e}")
            return Response({"error": "Failed to send newsletter."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny], url_path='unsubscribe/(?P<token>[^/.]+)')
    def unsubscribe(self, request, token=None):
        """
        Unsubscribe endpoint using a secure token.
        """
        try:
            subscriber = NewsletterSubscriber.objects.get(unsubscribe_token=token)
            subscriber.is_active = False
            subscriber.save()
            return Response({"status": "Successfully unsubscribed from the newsletter."})
        except NewsletterSubscriber.DoesNotExist:
            return Response({"error": "Invalid unsubscribe token."}, status=status.HTTP_400_BAD_REQUEST)

class TeamMemberViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing team member information.
    Public access for viewing, authenticated access for modifications.
    """
    queryset = TeamMember.objects.all().order_by('created_at')
    serializer_class = TeamMemberSerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing content categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]

    @method_decorator(cache_page(60 * 60 * 2))  # Cache for 2 hours
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class VideoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for video projects.
    Supports filtering by category and featured status, and searching by title/description.
    """
    queryset = Video.objects.select_related('category').all().order_by('-created_at')
    serializer_class = VideoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    permission_classes = [IsAdminOrReadOnly]


class PhotoViewSet(viewsets.ModelViewSet):
    """
    ViewSet for photo projects.
    Supports filtering, searching, and ordering.
    """
    queryset = Photo.objects.select_related('category').all().order_by('-created_at')
    serializer_class = PhotoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name', 'is_featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'title']
    permission_classes = [IsAdminOrReadOnly]


class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet for partner brands.
    """
    queryset = Brand.objects.all().order_by('-created_at')
    serializer_class = BrandSerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]

    @method_decorator(cache_page(60 * 60 * 2))  # Cache for 2 hours
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

class TestimonialViewSet(viewsets.ModelViewSet):
    """
    ViewSet for client testimonials.
    """
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]

    @method_decorator(cache_page(60 * 60 * 2))  # Cache for 2 hours
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

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
    permission_classes = [IsAdminOrReadOnly]

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
    permission_classes = [IsAdminOrReadOnly]

class EquipmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing equipment.
    """
    queryset = Equipment.objects.all().order_by('category', 'name')
    serializer_class = EquipmentSerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']

class PricingPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing pricing plans.
    """
    queryset = PricingPlan.objects.all().order_by('service_type', 'order')
    serializer_class = PricingPlanSerializer
    pagination_class = None
    permission_classes = [IsAdminOrReadOnly]

class CurrentUserView(views.APIView):
    """
    View to retrieve the currently authenticated user's details.
    Used for session verification on the frontend.
    Enforces TokenAuthentication to prevent session-based bypass (e.g. Django Admin).
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_staff': request.user.is_staff,
            'is_superuser': request.user.is_superuser
        })

# Cache Invalidation Signals
@receiver([post_save, post_delete], sender=Category)
@receiver([post_save, post_delete], sender=Brand)
@receiver([post_save, post_delete], sender=Testimonial)
def invalidate_cache(sender, **kwargs):
    """
    Invalidates the list cache when relevant models are updated.
    """
    # Note: We use a simple approach of clearing the entire cache or specific keys.
    # Since we use cache_page, keys are constructed by DRF/Django.
    # For a simple locmem setup, clearing all is often acceptable for small sites.
    cache.clear()
    logger.info(f"Cache invalidated due to change in {sender.__name__}")
