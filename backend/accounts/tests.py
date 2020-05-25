"""Simple tests for user authorization

Tests for each view (registration, login, getUser)
providing few correct request and few bad ones
"""

from django.contrib.auth.models import User
from django.urls import reverse

from rest_framework.test import APITestCase
from rest_framework import status

from knox.models import AuthToken

__author__ = 'Petr Hendrych'
__email__ = "xhendr03@fit.vutbr.cz"


# REGISTER TESTS
class RegisterViewTestCase(APITestCase):

    url = reverse("register")

    def test_correct_registration(self):
        data = {"username": "testcase", "email": "test@gmail.com", "password": "123456"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testcase')

    def test_bad_email_registration(self):
        data = {"username": "bademail", "email": "testgmail.com", "password": "abcd"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_username_registration(self):
        data = {"username": "", "email": "test3@gmail.com", "password": "jklpasw"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


# GET USER INFO TESTS
class UserViewTestCase(APITestCase):

    url = reverse("user_info")

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", email="test@tst.com", password="some-password")
        self.user2 = User.objects.create_user(username="second", email="second@test.com", password="other-pasw")
        self.token = AuthToken.objects.create(self.user)[1]
        self.token2 = AuthToken.objects.create(self.user2)[1]

    def test_user_info_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token)
        response = self.client.get(self.url)
        self.assertEqual(response.data, {'id': 7, 'username': 'testuser', 'email': 'test@tst.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_token_string(self):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.token + 'extrastring')
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_info_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


# LOGIN TESTS
class LoginViewTestCase(APITestCase):

    url = reverse("login")

    def setUp(self):
        self.user = User.objects.create_user(username="roman", email="roman@seznam.cz", password="123456")

    def test_existing_user_login(self):
        credentials = {"username": "roman", "password": "123456"}
        response = self.client.post(self.url, credentials)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'roman')

    def test_wrong_password_login(self):
        credentials = {"username": "roman", "password": "wrongpassword"}
        response = self.client.post(self.url, credentials)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_non_existing_user_login(self):
        credentials = {"username": "marcela", "password": "123456"}
        response = self.client.post(self.url, credentials)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
