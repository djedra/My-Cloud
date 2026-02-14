from rest_framework import serializers
from .models import File, Folder


class FolderSerializer(serializers.ModelSerializer):
    """Сериализатор для папки"""

    file_count = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = ('id', 'name', 'parent', 'created_at', 'file_count')
        read_only_fields = ('created_at',)

    def get_file_count(self, obj):
        return obj.files.count()


class FileSerializer(serializers.ModelSerializer):
    """Сериализатор для файла"""

    folder_name = serializers.CharField(source='folder.name', read_only=True)
    size_formatted = serializers.SerializerMethodField()
    uploaded_at_formatted = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    share_url = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = (
            'id', 'original_name', 'size', 'size_formatted', 'mime_type',
            'comment', 'uploaded_at', 'uploaded_at_formatted',
            'last_downloaded_at', 'folder', 'folder_name',
            'download_count', 'extension', 'download_url', 'share_url',
            'is_public'
        )
        read_only_fields = (
            'id', 'size', 'mime_type', 'uploaded_at',
            'last_downloaded_at', 'download_count', 'share_url'
        )

    def get_size_formatted(self, obj):
        return obj.get_human_readable_size()

    def get_uploaded_at_formatted(self, obj):
        return obj.uploaded_at.strftime('%d.%m.%Y %H:%M')

    def get_extension(self, obj):
        return obj.get_file_extension()

    def get_download_url(self, obj):
        return f"/api/storage/download-file/{obj.id}/"

    def get_share_url(self, obj):
        return f"/share/{obj.share_token}/"