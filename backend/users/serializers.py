from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import EmailValidator
from .models import CustomUser
import re


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'full_name', 'email', 'password', 'password2')
        extra_kwargs = {'username': {'validators': []}}

    def validate_username(self, value):
        if not re.match(r'^[a-zA-Z][a-zA-Z0-9]{3,19}$', value):
            raise serializers.ValidationError(
                'Логин должен начинаться с буквы, содержать только латинские буквы и цифры, длина от 4 до 20 символов')
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError('Пользователь с таким логином уже существует')
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('Пользователь с таким email уже существует')
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError('Пароль должен быть не менее 6 символов')
        if not any(c.isupper() for c in value):
            raise serializers.ValidationError('Пароль должен содержать хотя бы одну заглавную букву')
        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError('Пароль должен содержать хотя бы одну цифру')
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in value):
            raise serializers.ValidationError('Пароль должен содержать хотя бы один специальный символ')
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    storage_usage_percent = serializers.SerializerMethodField()
    used_storage_gb = serializers.SerializerMethodField()
    storage_quota_gb = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'full_name', 'email', 'is_admin', 'storage_usage_percent', 'used_storage_gb',
                  'storage_quota_gb', 'created_at', 'last_login')
        read_only_fields = ('id', 'created_at', 'last_login')

    def get_storage_usage_percent(self, obj):
        return obj.get_storage_usage_percent()

    def get_used_storage_gb(self, obj):
        return obj.get_used_storage_gb()

    def get_storage_quota_gb(self, obj):
        return obj.get_storage_quota_gb()


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'full_name', 'email', 'is_admin', 'is_active')