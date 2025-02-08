from django.test import TestCase
from django.urls import reverse
from django.urls import resolve

from rest_framework.test import APIClient
from rest_framework import status

from .models import User
from .serializer import UserSerializer
from .views import UserViewSet

class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='Testpassword123',
            first_name='Test',
            last_name='User'
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'testuser@example.com')
        self.assertEqual(self.user.username, 'testuser')
        self.assertTrue(self.user.check_password('Testpassword123'))

    def test_user_str_method(self):
        self.assertEqual(str(self.user), 'testuser@example.com')

    def test_user_is_active_by_default(self):
        self.assertTrue(self.user.is_active)

    def test_user_is_not_staff_by_default(self):
        self.assertFalse(self.user.is_staff)

    def test_user_is_not_superuser_by_default(self):
        self.assertFalse(self.user.is_superuser)

class UserViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='testuser@example.com',
            username='testuser',
            password='Testpassword123',
            first_name='Test',
            last_name='User'
        )

    def test_login(self):
        url = reverse('user-login')
        data = {'username': 'testuser', 'password': 'Testpassword123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        url = reverse('user-login')
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid credentials')

    def test_register(self):
        url = reverse('user-register')
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_register_existing_username(self):
        url = reverse('user-register')
        data = {'username': 'testuser', 'password': 'newpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Username already exists')

    def test_logout(self):
        # First, log in to get the refresh token
        login_url = reverse('user-login')
        login_data = {'username': 'testuser', 'password': 'Testpassword123'}
        login_response = self.client.post(login_url, login_data, format='json')
        
        # Verify that the login was successful
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('refresh', login_response.data)
        
        # Now, log out using the refresh token
        logout_url = reverse('user-logout')
        logout_data = {'refresh': login_response.data['refresh']}
        response = self.client.post(logout_url, logout_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['success'], 'User logged out')

    def test_logout_invalid_token(self):
        url = reverse('user-logout')
        data = {'refresh': 'invalidtoken'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Token is invalid or expired')

    def test_logout_unset_token(self):
        url = reverse('user-logout')
        response = self.client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Refresh token is required')

class URLTests(TestCase):
    def test_user_list_url_resolves(self):
        url = reverse('user-list')
        self.assertEqual(resolve(url).func.__name__, UserViewSet.as_view({'get': 'list'}).__name__)

    def test_user_login_url_resolves(self):
        url = reverse('user-login')
        self.assertEqual(resolve(url).func.__name__, UserViewSet.as_view({'post': 'login'}).__name__)

    def test_user_register_url_resolves(self):
        url = reverse('user-register')
        self.assertEqual(resolve(url).func.__name__, UserViewSet.as_view({'post': 'register'}).__name__)

    def test_user_logout_url_resolves(self):
        url = reverse('user-logout')
        self.assertEqual(resolve(url).func.__name__, UserViewSet.as_view({'post': 'logout'}).__name__)

class UserSerializerTest(TestCase):
    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'password': 'Testpassword123',
            'first_name': 'Test',
            'last_name': 'User',
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_serializer_serialization(self):
        """Prueba que el serializador serializa correctamente un usuario."""
        serializer = UserSerializer(self.user)
        expected_fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login'
        ]
        self.assertEqual(list(serializer.data.keys()), expected_fields)
        self.assertEqual(serializer.data['email'], self.user_data['email'])
        self.assertEqual(serializer.data['username'], self.user_data['username'])
        self.assertEqual(serializer.data['first_name'], self.user_data['first_name'])
        self.assertEqual(serializer.data['last_name'], self.user_data['last_name'])

    def test_user_serializer_deserialization(self):
        """Prueba que el serializador deserializa correctamente los datos para crear un usuario."""
        new_user_data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'Newpassword123',
            'first_name': 'New',
            'last_name': 'User',
        }
        serializer = UserSerializer(data=new_user_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.email, new_user_data['email'])
        self.assertEqual(user.username, new_user_data['username'])
        self.assertEqual(user.first_name, new_user_data['first_name'])
        self.assertEqual(user.last_name, new_user_data['last_name'])

    def test_user_serializer_invalid_data(self):
        """Prueba que el serializador valida correctamente los datos inválidos."""
        invalid_user_data = {
            'email': 'invalidemail',
            'username': '',
            'password': 'short',
            'first_name': 'Test',
            'last_name': 'User',
        }
        serializer = UserSerializer(data=invalid_user_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)
        self.assertIn('username', serializer.errors)
        self.assertIn('password', serializer.errors)

    def test_user_serializer_update(self):
        """Prueba que el serializador actualiza correctamente un usuario existente."""
        updated_data = {
            'first_name': 'Updated',
            'last_name': 'User',
        }
        serializer = UserSerializer(self.user, data=updated_data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.first_name, updated_data['first_name'])
        self.assertEqual(updated_user.last_name, updated_data['last_name'])