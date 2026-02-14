import { api } from './api';

class UserService {
    // Получение списка пользователей
    async getUsers(params = {}) {
        try {
            const response = await api.get('/users/users/', { params });
            // DRF возвращает пагинированные данные
            return response.data.results || response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка получения списка пользователей' };
        }
    }

    // Получение пользователя по ID
    async getUserById(userId) {
        try {
            const response = await api.get(`/users/users/${userId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка получения данных пользователя' };
        }
    }

    // Обновление пользователя
    async updateUser(userId, userData) {
        try {
            const response = await api.put(`/users/users/${userId}/`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка обновления пользователя' };
        }
    }

    // Удаление пользователя
    async deleteUser(userId) {
        try {
            const response = await api.delete(`/users/users/${userId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка удаления пользователя' };
        }
    }
}

export default new UserService();