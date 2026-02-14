from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'full_name', 'is_admin', 'is_active', 'storage_usage_display')
    list_filter = ('is_admin', 'is_active', 'created_at')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('full_name', 'email', 'avatar')}),
        ('Хранилище', {'fields': ('storage_quota', 'used_storage')}),
        ('Права', {'fields': ('is_admin', 'is_active', 'is_staff', 'is_superuser')}),
        ('Даты', {'fields': ('last_login', 'created_at', 'updated_at')}),
        ('Безопасность', {'fields': ('last_login_ip',)}),
    )
    readonly_fields = ('created_at', 'updated_at', 'used_storage')
    search_fields = ('username', 'email', 'full_name')
    ordering = ('-created_at',)

    def storage_usage_display(self, obj):
        """Отображение использования хранилища в списке"""
        return f"{obj.get_used_storage_gb()} GB / {obj.get_storage_quota_gb()} GB"

    storage_usage_display.short_description = 'Хранилище'
    storage_usage_display.admin_order_field = 'used_storage'