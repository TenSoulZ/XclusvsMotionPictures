"""
URL Configuration for the Portfolio App.
Registers all ViewSets with the REST Framework DefaultRouter.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, VideoViewSet, PhotoViewSet, ContactMessageViewSet, BrandViewSet, TestimonialViewSet, BlogPostViewSet, LiveStreamViewSet, TeamMemberViewSet, PricingPlanViewSet, NewsletterSubscriberViewSet, CurrentUserView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'videos', VideoViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'newsletter', NewsletterSubscriberViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'blog', BlogPostViewSet)
router.register(r'live', LiveStreamViewSet)
router.register(r'team', TeamMemberViewSet)
router.register(r'pricing-plans', PricingPlanViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
