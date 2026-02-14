from django.contrib import admin
from .models import File, Folder


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('original_name', 'user', 'size_formatted', 'uploaded_at', 'download_count', 'is_public')
    list_filter = ('is_public', 'uploaded_at', 'user')
    search_fields = ('original_name', 'comment', 'user__username')
    readonly_fields = ('size', 'mime_type', 'share_token', 'download_count', 'uploaded_at', 'last_downloaded_at')
    actions = ['make_public', 'make_private', 'hard_delete_files']

    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'folder', 'file', 'original_name', 'comment')
        }),
        ('Метаданные файла', {
            'fields': ('size', 'mime_type'),
            'classes': ('collapse',)
        }),
        ('Дополнительные настройки', {
            'fields': ('is_public', 'is_deleted', 'deleted_at'),
            'classes': ('collapse',)
        }),
    )

    def size_formatted(self, obj):
        return obj.get_human_readable_size()

    size_formatted.short_description = 'Размер'

    def make_public(self, request, queryset):
        updated = queryset.update(is_public=True)
        self.message_user(request, f'Сделано публичными: {updated} файлов')

    make_public.short_description = 'Сделать публичными'

    def make_private(self, request, queryset):
        updated = queryset.update(is_public=False)
        self.message_user(request, f'Сделано приватными: {updated} файлов')

    make_private.short_description = 'Сделать приватными'

    def hard_delete_files(self, request, queryset):
        count = 0
        for file in queryset:
            file.hard_delete()
            count += 1
        self.message_user(request, f'Полностью удалено: {count} файлов')

    hard_delete_files.short_description = 'Полное удаление'


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'parent', 'created_at')
    list_filter = ('user', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')