import { api } from './api';

class UserService {
    /**
     * Получение списка пользователей с поддержкой пагинации DRF
     * @param {Object} params - Параметры запроса (поиск, пагинация)
     * @returns {Promise<Array>} Массив пользователей
     */
    async getUsers(params = {}) {
        try {
            const response = await api.get('/users/users/', { params });
            
            // DRF возвращает пагинированные данные: {count, next, previous, results}
            // Извлекаем массив из поля 'results' или возвращаем весь ответ как массив
            if (Array.isArray(response.data)) {
                return response.data;
            }
            return response.data.results || [];
        } catch (error) {
            // Обработка ошибок с детальным сообщением
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.detail || 
                               'Ошибка получения списка пользователей';
            throw { error: errorMessage, status: error.response?.status };
        }
    }

    /**
     * Получение пользователя по ID
     * @param {number} userId - ID пользователя
     * @returns {Promise<Object>} Данные пользователя
     */
    async getUserById(userId) {
        try {
            const response = await api.get(`/users/users/${userId}/`);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.detail || 
                               'Ошибка получения данных пользователя';
            throw { error: errorMessage, status: error.response?.status };
        }
    }

    /**
     * Обновление пользователя (включая изменение статуса администратора)
     * Требует прав администратора для изменения поля is_admin
     * @param {number} userId - ID пользователя
     * @param {Object} userData - Данные для обновления {is_admin, is_active, ...}
     * @returns {Promise<Object>} Обновленные данные пользователя
     */
    async updateUser(userId, userData) {
        try {
            const response = await api.put(`/users/users/${userId}/`, userData);
            return response.data;
        } catch (error) {
            // Специальная обработка ошибок изменения прав администратора
            let errorMessage = error.response?.data?.error || 
                             error.response?.data?.detail || 
                             'Ошибка обновления пользователя';
            
            // Детализация для специфических ошибок
            if (error.response?.status === 403) {
                errorMessage = 'У вас нет прав для изменения прав администратора';
            } else if (error.response?.status === 400 && error.response?.data?.is_admin) {
                errorMessage = error.response.data.is_admin[0] || 'Ошибка изменения прав администратора';
            }
            
            throw { error: errorMessage, status: error.response?.status };
        }
    }

    /**
     * Удаление пользователя
     * Требует прав администратора. Нельзя удалить последнего администратора.
     * @param {number} userId - ID пользователя
     * @returns {Promise<number>} ID удаленного пользователя
     */
    async deleteUser(userId) {
        try {
            await api.delete(`/users/users/${userId}/`);
            return userId;
        } catch (error) {
            // Специальная обработка ошибок удаления
            let errorMessage = error.response?.data?.error || 
                             error.response?.data?.detail || 
                             'Ошибка удаления пользователя';
            
            // Детализация для специфических ошибок
            if (error.response?.status === 403) {
                errorMessage = 'У вас нет прав для удаления пользователей';
            } else if (error.response?.status === 400) {
                errorMessage = error.response.data.error || 'Нельзя удалить последнего администратора';
            }
            
            throw { error: errorMessage, status: error.response?.status };
        }
    }
}

export default new UserService();