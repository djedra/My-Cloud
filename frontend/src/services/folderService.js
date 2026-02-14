import { api } from './api';

class FolderService {
    // Получение списка папок
    async getFolders(params = {}) {
        try {
            const response = await api.get('/storage/folders/', { params });
            // DRF возвращает пагинированные данные: {count, next, previous, results}
            // Извлекаем массив из поля 'results'
            return response.data.results || response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка получения списка папок' };
        }
    }

    // Создание папки
    async createFolder(folderData) {
        try {
            const response = await api.post('/storage/folders/', folderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка создания папки' };
        }
    }

    // Обновление папки
    async updateFolder(folderId, folderData) {
        try {
            const response = await api.put(`/storage/folders/${folderId}/`, folderData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка обновления папки' };
        }
    }

    // Удаление папки
    async deleteFolder(folderId) {
        try {
            const response = await api.delete(`/storage/folders/${folderId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка удаления папки' };
        }
    }
}

export default new FolderService();