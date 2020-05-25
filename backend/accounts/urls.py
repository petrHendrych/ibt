"""URLs for Django accounts application

Defining URL endpoints for authorization requests
"""

from django.urls import path
from .views import RegisterView, LoginView, UserView
from knox import views as knox_views

__author__ = 'Petr Hendrych'
__email__ = "xhendr03@fit.vutbr.cz"

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('user', UserView.as_view(), name='user_info'),
    path('logout', knox_views.LogoutView.as_view(), name='knox_logout')
]