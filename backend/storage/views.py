from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse, Http404
from django.utils import timezone
from django.db.models import Q
import os

from .models import File, Folder
from .serializers import FileSerializer, FolderSerializer
from users.models import CustomUser


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_files(request):
    """Получение списка файлов пользователя"""
    user = request.user
    user_id = request.query_params.get('user_id')
    folder_id = request.query_params.get('folder_id')

    # Администратор может просматривать файлы любого пользователя
    if user.is_admin and user_id:
        try:
            target_user = CustomUser.objects.get(id=user_id)
            files = File.objects.filter(user=target_user, is_deleted=False)
        except CustomUser.DoesNotExist:
            return Response({
                'error': 'Пользователь не найден'
            }, status=status.HTTP_404_NOT_FOUND)
    else:
        files = File.objects.filter(user=user, is_deleted=False)

    # Фильтрация по папке
    if folder_id:
        files = files.filter(folder_id=folder_id)
    else:
        files = files.filter(folder__isnull=True)

    # Поиск
    search = request.query_params.get('search', None)
    if search:
        files = files.filter(
            Q(original_name__icontains=search) |
            Q(comment__icontains=search)
        )

    serializer = FileSerializer(files, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """Загрузка файла"""
    user = request.user
    file_obj = request.FILES.get('file')
    comment = request.data.get('comment', '')
    folder_id = request.data.get('folder_id')

    if not file_obj:
        return Response({
            'error': 'Файл не предоставлен'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Проверка размера файла
    if file_obj.size > user.storage_quota:
        return Response({
            'error': 'Размер файла превышает вашу квоту хранилища'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Проверка доступного места
    if not user.has_storage_space(file_obj.size):
        return Response({
            'error': 'Недостаточно места в хранилище'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Проверка папки (если указана)
    folder = None
    if folder_id:
        try:
            folder = Folder.objects.get(id=folder_id, user=user)
        except Folder.DoesNotExist:
            return Response({
                'error': 'Папка не найдена'
            }, status=status.HTTP_404_NOT_FOUND)

    # Создание записи о файле
    file = File.objects.create(
        user=user,
        folder=folder,
        original_name=file_obj.name,
        file=file_obj,
        size=file_obj.size,
        comment=comment
    )

    serializer = FileSerializer(file)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    """Удаление файла"""
    try:
        file = File.objects.get(id=file_id)

        # Проверка прав доступа
        if file.user != request.user and not request.user.is_admin:
            return Response({
                'error': 'Нет прав доступа'
            }, status=status.HTTP_403_FORBIDDEN)

        file.delete()  # Мягкое удаление
        return Response({
            'message': 'Файл удален'
        }, status=status.HTTP_200_OK)
    except File.DoesNotExist:
        return Response({
            'error': 'Файл не найден'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def rename_file(request, file_id):
    """Переименование файла"""
    try:
        file = File.objects.get(id=file_id)

        # Проверка прав доступа
        if file.user != request.user and not request.user.is_admin:
            return Response({
                'error': 'Нет прав доступа'
            }, status=status.HTTP_403_FORBIDDEN)

        new_name = request.data.get('new_name')
        if not new_name:
            return Response({
                'error': 'Новое имя не указано'
            }, status=status.HTTP_400_BAD_REQUEST)

        file.original_name = new_name
        file.save()

        serializer = FileSerializer(file)
        return Response(serializer.data)
    except File.DoesNotExist:
        return Response({
            'error': 'Файл не найден'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_file_comment(request, file_id):
    """Обновление комментария к файлу"""
    try:
        file = File.objects.get(id=file_id)

        # Проверка прав доступа
        if file.user != request.user and not request.user.is_admin:
            return Response({
                'error': 'Нет прав доступа'
            }, status=status.HTTP_403_FORBIDDEN)

        comment = request.data.get('comment', '')
        file.comment = comment
        file.save()

        serializer = FileSerializer(file)
        return Response(serializer.data)
    except File.DoesNotExist:
        return Response({
            'error': 'Файл не найден'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_file(request, file_id):
    """Скачивание файла"""
    try:
        file = File.objects.get(id=file_id)

        # Проверка прав доступа
        if file.user != request.user and not request.user.is_admin:
            return Response({
                'error': 'Нет прав доступа'
            }, status=status.HTTP_403_FORBIDDEN)

        # Обновление времени последнего скачивания и счетчика
        file.last_downloaded_at = timezone.now()
        file.download_count += 1
        file.save()

        # Отправка файла с оригинальным именем
        response = FileResponse(
            file.file.open(),
            content_type=file.mime_type or 'application/octet-stream'
        )
        response['Content-Disposition'] = f'attachment; filename="{file.original_name}"'
        response['Content-Length'] = file.size

        return response
    except File.DoesNotExist:
        raise Http404('Файл не найден')
    except FileNotFoundError:
        return Response({
            'error': 'Файл не найден на сервере'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def download_file_by_token(request, token):
    """Скачивание файла по специальному токену (публичная ссылка)"""
    try:
        file = File.objects.get(share_token=token, is_deleted=False, is_public=True)

        # Обновление времени последнего скачивания и счетчика
        file.last_downloaded_at = timezone.now()
        file.download_count += 1
        file.save()

        # Отправка файла с оригинальным именем
        response = FileResponse(
            file.file.open(),
            content_type=file.mime_type or 'application/octet-stream'
        )
        response['Content-Disposition'] = f'attachment; filename="{file.original_name}"'
        response['Content-Length'] = file.size

        return response
    except File.DoesNotExist:
        raise Http404('Файл не найден или недоступен')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_file_public(request, file_id):
    """Переключение публичного статуса файла"""
    try:
        file = File.objects.get(id=file_id)

        # Проверка прав доступа
        if file.user != request.user and not request.user.is_admin:
            return Response({
                'error': 'Нет прав доступа'
            }, status=status.HTTP_403_FORBIDDEN)

        file.is_public = not file.is_public
        file.save()

        serializer = FileSerializer(file)
        return Response(serializer.data)
    except File.DoesNotExist:
        return Response({
            'error': 'Файл не найден'
        }, status=status.HTTP_404_NOT_FOUND)


# Views для папок
class FolderListCreateView(generics.ListCreateAPIView):
    """Список и создание папок"""
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user, parent__isnull=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Детали, обновление и удаление папки"""
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)