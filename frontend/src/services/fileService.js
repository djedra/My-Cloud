import { api } from './api';

class FileService {
    // Получение списка файлов
    async getFiles(params = {}) {
        try {
            const response = await api.get('/storage/files/', { params });
            // DRF возвращает пагинированные данные
            return response.data.results || response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка получения списка файлов' };
        }
    }

    // Загрузка файла
    async uploadFile(formData) {
        try {
            const response = await api.post('/storage/files/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка загрузки файла' };
        }
    }

    // Удаление файла
    async deleteFile(fileId) {
        try {
            const response = await api.delete(`/storage/files/${fileId}/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка удаления файла' };
        }
    }

    // Переименование файла
    async renameFile(fileId, newName) {
        try {
            const response = await api.put(`/storage/files/${fileId}/rename/`, { new_name: newName });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка переименования файла' };
        }
    }

    // Обновление комментария к файлу
    async updateComment(fileId, comment) {
        try {
            const response = await api.put(`/storage/files/${fileId}/comment/`, { comment });
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка обновления комментария' };
        }
    }

    // Переключение публичного статуса файла
    async togglePublic(fileId) {
        try {
            const response = await api.post(`/storage/files/${fileId}/public/`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Ошибка изменения статуса файла' };
        }
    }

    // Получение публичной ссылки на файл
    getPublicUrl(shareToken) {
        return `${window.location.origin}/share/${shareToken}/`;
    }
}

export default new FileService();