"""Authorization serializers for user API requests and responses

Three simple serializers to manage login, register and get user data requests
This code was written by following online tutorial you can find on
this link: https://www.youtube.com/playlist?list=PLXE2Bj4edhg5fnlk8C8e-aEONQNPPuqNp
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

__author__ = 'Petr Hendrych'
__credits__ = ['Brad Traversy']
__email__ = "xhendr03@fit.vutbr.cz"


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user


# Login Serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
