from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator
import uuid
import os


def user_avatar_path(instance, filename):
    """Генерация пути для аватара пользователя"""
    ext = os.path.splitext(filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    return os.path.join('avatars', f'user_{instance.id}', filename)


class CustomUser(AbstractUser):
    """Кастомная модель пользователя для Django 6.0.2"""

    # Валидаторы
    username_validator = RegexValidator(
        regex=r'^[a-zA-Z][a-zA-Z0-9]{3,19}$',
        message='Логин должен начинаться с буквы, содержать только латинские буквы и цифры, длина от 4 до 20 символов'
    )

    # Поля пользователя
    email = models.EmailField(
        unique=True,
        verbose_name='Email адрес',
        help_text='Введите действительный email адрес'
    )

    full_name = models.CharField(
        max_length=255,
        verbose_name='Полное имя',
        help_text='Ваше полное имя',
        validators=[MinLengthValidator(2)]
    )

    is_admin = models.BooleanField(
        default=False,
        verbose_name='Администратор',
        help_text='Имеет права администратора системы',
        db_index=True
    )

    storage_quota = models.BigIntegerField(
        default=5 * 1024 * 1024 * 1024,  # 5GB по умолчанию
        verbose_name='Квота хранилища (байт)',
        help_text='Максимальный размер хранилища в байтах',
        db_index=True
    )

    used_storage = models.BigIntegerField(
        default=0,
        verbose_name='Использовано (байт)',
        help_text='Текущий объем использованного хранилища',
        db_index=True
    )

    avatar = models.ImageField(
        upload_to=user_avatar_path,
        null=True,
        blank=True,
        verbose_name='Аватар',
        max_length=500
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
        db_index=True
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    # Дополнительные поля для безопасности
    last_login_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='IP последнего входа'
    )

    last_login_user_agent = models.CharField(
        max_length=500,
        blank=True,
        verbose_name='User Agent последнего входа'
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name='Активен',
        db_index=True
    )

    is_verified = models.BooleanField(
        default=False,
        verbose_name='Email подтвержден',
        db_index=True
    )

    verification_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        verbose_name='Токен верификации'
    )

    # Метаданные
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Дополнительные метаданные'
    )

    REQUIRED_FIELDS = ['email', 'full_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['username', 'email']),
            models.Index(fields=['is_admin', 'is_active']),
        ]
        # Убираем constraints - они вызывают ошибку в текущей версии

    def __str__(self):
        return f"{self.username} ({self.email})"

    def save(self, *args, **kwargs):
        # Нормализация email
        if self.email:
            self.email = self.email.lower()

        # Ограничение максимального использованного хранилища
        if self.used_storage > self.storage_quota:
            self.used_storage = self.storage_quota

        super().save(*args, **kwargs)

    def get_used_storage_gb(self):
        """Возвращает использованное хранилище в ГБ"""
        return round(self.used_storage / (1024 ** 3), 2)

    def get_storage_quota_gb(self):
        """Возвращает квоту хранилища в ГБ"""
        return round(self.storage_quota / (1024 ** 3), 2)

    def get_storage_usage_percent(self):
        """Возвращает процент использования хранилища"""
        if self.storage_quota == 0:
            return 0
        return round((self.used_storage / self.storage_quota) * 100, 2)

    def has_storage_space(self, file_size):
        """Проверяет, достаточно ли места для файла"""
        return self.used_storage + file_size <= self.storage_quota

    def can_upload_file(self, file_size):
        """Проверяет возможность загрузки файла"""
        if not self.is_active:
            return False, "Аккаунт не активен"

        if not self.has_storage_space(file_size):
            return False, "Недостаточно места в хранилище"

        return True, "OK"

    def add_storage_usage(self, size):
        """Добавляет использованное хранилище"""
        self.used_storage += size
        self.save(update_fields=['used_storage', 'updated_at'])

    def remove_storage_usage(self, size):
        """Уменьшает использованное хранилище"""
        self.used_storage = max(0, self.used_storage - size)
        self.save(update_fields=['used_storage', 'updated_at'])

    @property
    def storage_usage_display(self):
        """Отображение использования хранилища"""
        return f"{self.get_used_storage_gb()} GB / {self.get_storage_quota_gb()} GB"

    def get_absolute_url(self):
        """URL для админки"""
        from django.urls import reverse
        return reverse('admin:users_customuser_change', args=[self.id])