from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q
from django.core.exceptions import ValidationError

from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, UserUpdateSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Регистрация нового пользователя"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Генерация JWT токенов
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Регистрация успешна'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Аутентификация пользователя"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            'error': 'Логин и пароль обязательны'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        if not user.is_active:
            return Response({
                'error': 'Аккаунт деактивирован'
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Вход выполнен успешно'
        })
    else:
        return Response({
            'error': 'Неверные учетные данные'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Выход пользователя с блокировкой refresh токена.
    Требует установленного приложения 'rest_framework_simplejwt.token_blacklist' в INSTALLED_APPS.
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            # Блокировка токена в черном списке
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Выход выполнен успешно'}, status=status.HTTP_200_OK)
    except Exception as e:
        # Обработка ошибок блокировки токена
        return Response({
            'error': 'Ошибка при выходе из системы',
            'detail': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Получение информации о текущем пользователе"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserListView(generics.ListAPIView):
    """Список пользователей (только для администраторов)"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            queryset = CustomUser.objects.all()
        else:
            queryset = CustomUser.objects.filter(id=user.id)

        # Фильтрация по поиску
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(full_name__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Детали, обновление и удаление пользователя"""
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return CustomUser.objects.all()
        return CustomUser.objects.filter(id=user.id)

    def update(self, request, *args, **kwargs):
        """
        Обновление пользователя с проверкой прав:
        - Только администратор может изменять поле is_admin
        - Нельзя снять права с последнего администратора
        - Только администратор может деактивировать других пользователей
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        user = request.user

        # Проверка попытки изменения прав администратора
        if 'is_admin' in request.data:
            # Только админ может менять статус администратора
            if not user.is_admin:
                return Response({
                    'error': 'Только администратор может изменять права администратора'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Проверка попытки снять права с последнего администратора
            new_is_admin_value = request.data['is_admin']
            if instance.is_admin and not new_is_admin_value:
                if CustomUser.objects.filter(is_admin=True).count() == 1:
                    return Response({
                        'error': 'Нельзя снять права администратора с последнего администратора системы'
                    }, status=status.HTTP_400_BAD_REQUEST)

        # Проверка попытки деактивации пользователя
        if 'is_active' in request.data and not request.data['is_active']:
            # Пользователь может деактивировать только свой аккаунт
            if instance.id != user.id and not user.is_admin:
                return Response({
                    'error': 'Вы можете деактивировать только свой аккаунт'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Администратор не может деактивировать самого себя через этот эндпоинт
            if instance.id == user.id and user.is_admin:
                return Response({
                    'error': 'Администратор не может деактивировать свой аккаунт через этот интерфейс'
                }, status=status.HTTP_400_BAD_REQUEST)

        # Валидация и сохранение данных
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            # Обновляем данные пользователя после сохранения
            instance.refresh_from_db()
            
            return Response(UserSerializer(instance).data)
        except ValidationError as e:
            return Response({
                'error': 'Ошибка валидации данных',
                'detail': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Ошибка при обновлении пользователя',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        """
        Удаление пользователя с проверкой прав:
        - Только администратор может удалять пользователей
        - Нельзя удалить последнего администратора
        """
        if not request.user.is_admin:
            return Response({
                'error': 'У вас нет прав для удаления пользователей'
            }, status=status.HTTP_403_FORBIDDEN)

        instance = self.get_object()
        
        # Проверка попытки удаления последнего администратора
        if instance.is_admin and CustomUser.objects.filter(is_admin=True).count() == 1:
            return Response({
                'error': 'Нельзя удалить последнего администратора системы'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Выполнение мягкого удаления (пометка как неактивного)
        instance.is_active = False
        instance.save()
        
        return Response({
            'message': f'Пользователь {instance.username} успешно деактивирован'
        }, status=status.HTTP_200_OK)