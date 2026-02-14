import os
import uuid
from django.db import models
from django.utils import timezone
from users.models import CustomUser


def upload_to(instance, filename):
    """
    Генерация уникального пути для сохранения файла.
    Формат: user_{user_id}/{uuid}/{original_filename}
    """
    ext = os.path.splitext(filename)[1]
    unique_filename = f"{uuid.uuid4()}{ext}"
    return os.path.join(f'user_{instance.user.id}', 'files', unique_filename)


class Folder(models.Model):
    """Модель папки для организации файлов"""

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='folders',
        verbose_name='Пользователь'
    )

    name = models.CharField(
        max_length=255,
        verbose_name='Название папки'
    )

    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subfolders',
        verbose_name='Родительская папка'
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Дата обновления'
    )

    class Meta:
        verbose_name = 'Папка'
        verbose_name_plural = 'Папки'
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_full_path(self):
        """Возвращает полный путь к папке"""
        if self.parent:
            return f"{self.parent.get_full_path()}/{self.name}"
        return self.name


class File(models.Model):
    """Модель файла"""

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='Пользователь'
    )

    folder = models.ForeignKey(
        Folder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='files',
        verbose_name='Папка'
    )

    original_name = models.CharField(
        max_length=255,
        verbose_name='Оригинальное имя файла'
    )

    file = models.FileField(
        upload_to=upload_to,
        verbose_name='Файл'
    )

    size = models.BigIntegerField(
        verbose_name='Размер файла (байт)',
        default=0  # Добавляем дефолтное значение
    )

    mime_type = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='MIME тип',
        default='application/octet-stream'  # Добавляем дефолтное значение
    )

    comment = models.TextField(
        blank=True,
        verbose_name='Комментарий'
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки'
    )

    last_downloaded_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата последнего скачивания'
    )

    share_token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        verbose_name='Токен для шеринга'
    )

    is_public = models.BooleanField(
        default=False,
        verbose_name='Публичный файл'
    )

    download_count = models.IntegerField(
        default=0,
        verbose_name='Количество скачиваний'
    )

    is_deleted = models.BooleanField(
        default=False,
        verbose_name='Удален'
    )

    deleted_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата удаления'
    )

    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.original_name

    def save(self, *args, **kwargs):
        # Автоматическое определение размера файла
        if hasattr(self.file, 'size') and self.file.size is not None:
            self.size = self.file.size

        # Автоматическое определение оригинального имени
        if not self.original_name and hasattr(self.file, 'name'):
            self.original_name = os.path.basename(self.file.name)

        # Автоматическое определение MIME типа (если не установлен)
        if not self.mime_type or self.mime_type == 'application/octet-stream':
            if hasattr(self.file, 'file'):
                try:
                    import magic
                    self.mime_type = magic.from_buffer(self.file.read(1024), mime=True)
                    self.file.seek(0)
                except (ImportError, Exception):
                    # Если python-magic не установлен или ошибка
                    ext = os.path.splitext(self.original_name)[1].lower()
                    mime_types = {
                        '.jpg': 'image/jpeg',
                        '.jpeg': 'image/jpeg',
                        '.png': 'image/png',
                        '.gif': 'image/gif',
                        '.bmp': 'image/bmp',
                        '.pdf': 'application/pdf',
                        '.txt': 'text/plain',
                        '.doc': 'application/msword',
                        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        '.xls': 'application/vnd.ms-excel',
                        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    }
                    self.mime_type = mime_types.get(ext, 'application/octet-stream')

        is_new = self.pk is None
        super().save(*args, **kwargs)

        if is_new:
            self.user.used_storage += self.size
            self.user.save()

    def delete(self, *args, **kwargs):
        """Мягкое удаление файла"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.user.used_storage -= self.size
        self.user.save()
        super().save(*args, **kwargs)

    def hard_delete(self, *args, **kwargs):
        """Полное удаление файла"""
        if self.file:
            if os.path.exists(self.file.path):
                os.remove(self.file.path)

        user = self.user
        size = self.size

        super().delete(*args, **kwargs)

        # Обновление использованного хранилища
        user.used_storage -= size
        user.save()

    def get_download_url(self):
        """Возвращает URL для скачивания файла"""
        return f"/api/storage/download/{self.share_token}/"

    def get_file_extension(self):
        """Возвращает расширение файла"""
        return os.path.splitext(self.original_name)[1][1:].lower()

    def is_image(self):
        """Проверяет, является ли файл изображением"""
        return self.mime_type.startswith('image/')

    def is_document(self):
        """Проверяет, является ли файл документом"""
        return self.mime_type.startswith('application/') or self.mime_type.startswith('text/')

    def get_human_readable_size(self):
        """Возвращает размер файла в читаемом формате"""
        size = self.size
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size < 1024.0:
                return f"{size:.2f} {unit}"
            size /= 1024.0
        return f"{size:.2f} PB"