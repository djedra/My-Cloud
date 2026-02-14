from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Q

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
    """Выход пользователя"""
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Выход выполнен успешно'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


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

        # Фильтрация
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

    def delete(self, request, *args, **kwargs):
        """Удаление пользователя (только админ)"""
        if not request.user.is_admin:
            return Response({
                'error': 'У вас нет прав для удаления пользователей'
            }, status=status.HTTP_403_FORBIDDEN)

        user = self.get_object()
        if user.is_admin and CustomUser.objects.filter(is_admin=True).count() == 1:
            return Response({
                'error': 'Нельзя удалить последнего администратора'
            }, status=status.HTTP_400_BAD_REQUEST)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)