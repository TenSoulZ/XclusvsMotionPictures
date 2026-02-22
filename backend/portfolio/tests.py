from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import BlogPost, Category, NewsletterSubscriber

class BlogPostModelTest(TestCase):
    """
    Tests for the BlogPost model.
    """

    def test_slug_is_generated_on_save(self):
        """
        Test that the slug is automatically generated from the title when a BlogPost is saved.
        """
        blog_post = BlogPost.objects.create(
            title="My First Blog Post",
            content="This is the content of my first blog post.",
            # featured_image is required, but for this test we can use a dummy value
            # as we are not testing the image field itself.
            featured_image="dummy.jpg" 
        )
        self.assertEqual(blog_post.slug, "my-first-blog-post")

    def test_slug_uniqueness(self):
        """
        Test that duplicate titles result in unique slugs.
        """
        post1 = BlogPost.objects.create(
            title="Unique Title",
            content="Content 1",
            featured_image="img1.jpg"
        )
        post2 = BlogPost.objects.create(
            title="Unique Title",
            content="Content 2",
            featured_image="img2.jpg"
        )
        self.assertEqual(post1.slug, "unique-title")
        self.assertEqual(post2.slug, "unique-title-1")

@override_settings(SECURE_SSL_REDIRECT=False)
class NewsletterAPITest(APITestCase):
    """
    Tests for the Newsletter API permissions.
    """

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.admin = User.objects.create_superuser(username='admin', password='adminpassword', email='admin@test.com')
        NewsletterSubscriber.objects.create(email='subscriber@test.com')

    def test_list_subscribers_unauthenticated(self):
        self.client.logout()
        response = self.client.get('/api/newsletter/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_subscribers_authenticated_non_admin(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/newsletter/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_subscribers_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/newsletter/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle pagination
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 1)

@override_settings(SECURE_SSL_REDIRECT=False)
class CategoryAPITest(APITestCase):
    """
    Tests for the Category API.
    """

    def setUp(self):
        # Create a user for authentication
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_list_categories(self):
        """
        Ensure we can list all categories.
        """
        Category.objects.create(name='Weddings', slug='weddings')
        Category.objects.create(name='Corporate', slug='corporate')
        
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_category_authenticated(self):
        """
        Ensure an authenticated user can create a new category.
        """
        self.client.force_authenticate(user=self.user)
        data = {'name': 'Music Videos', 'slug': 'music-videos'}
        response = self.client.post('/api/categories/', data, format='json')
        # In our IsAdminOrReadOnly permission, only staff can create
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual(Category.objects.count(), 1)
        # self.assertEqual(Category.objects.get().name, 'Music Videos')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_create_category_unauthenticated(self):
        """
        Ensure an unauthenticated user cannot create a new category.
        """
        self.client.logout()
        data = {'name': 'Music Videos', 'slug': 'music-videos'}
        response = self.client.post('/api/categories/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_create_category_as_admin(self):
        """
        Ensure an admin user can create a new category.
        """
        admin_user = User.objects.create_superuser(username='admin', password='adminpassword', email='admin@test.com')
        self.client.force_authenticate(user=admin_user)
        data = {'name': 'Admin Category', 'slug': 'admin-category'}
        response = self.client.post('/api/categories/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().name, 'Admin Category')
