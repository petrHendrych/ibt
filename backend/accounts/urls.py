from django.urls import path, include
from .views import RegisterView, LoginView, UserView
from knox import views as knox_views

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('logout', knox_views.LogoutView.as_view(), name='knox_logout')
]