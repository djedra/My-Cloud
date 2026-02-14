import { api } from './api';

class AuthService {
    // Регистрация пользователя
    async register(userData) {
        try {
            const response = await api.post('/users/register/', userData);
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка регистрации' };
        }
    }

    // Вход в систему
    async login(credentials) {
        try {
            const response = await api.post('/users/login/', credentials);
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка входа' };
        }
    }

    // Выход из системы
    async logout() {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await api.post('/users/logout/', { refresh: refreshToken });
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    }

    // Получение текущего пользователя
    async getCurrentUser() {
        try {
            const response = await api.get('/users/me/');
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка получения данных пользователя' };
        }
    }

    // Проверка аутентификации
    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    // Получение текущего пользователя из localStorage
    getCurrentUserFromStorage() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

export default new AuthService();