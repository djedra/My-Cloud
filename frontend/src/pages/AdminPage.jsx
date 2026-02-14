import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/slices/usersSlice';
import UserList from '../components/admin/UserList';
import StorageUsage from '../components/files/StorageUsage';
import './AdminPage.css';

const AdminPage = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector(state => state.users);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (!user?.is_admin) {
        return (
            <div className="admin-page">
                <div className="admin-container">
                    <div className="access-denied">
                        <h2>Доступ запрещен</h2>
                        <p>У вас нет прав администратора для просмотра этой страницы</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Администрирование</h1>
                <StorageUsage />
            </div>
            
            <div className="admin-content">
                <div className="admin-stats">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-label">Пользователей</div>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">📁</div>
                        <div className="stat-info">
                            <div className="stat-value">0</div>
                            <div className="stat-label">Всего файлов</div>
                        </div>
                    </div>
                    
                    <div className="stat-card">
                        <div className="stat-icon">💾</div>
                        <div className="stat-info">
                            <div className="stat-value">0 GB</div>
                            <div className="stat-label">Использовано</div>
                        </div>
                    </div>
                </div>
                
                <div className="admin-section">
                    <h2>Список пользователей</h2>
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Загрузка пользователей...</p>
                        </div>
                    ) : (
                        <UserList users={users} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;