import React from 'react';
import Button from '../ui/Button';
import './UserList.css';

const UserItem = ({ user }) => {
    const handleEdit = () => {
        alert(`Редактирование пользователя ${user.username}`);
    };

    const handleDelete = () => {
        if (window.confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
            alert(`Удаление пользователя ${user.username}`);
        }
    };

    return (
        <tr>
            <td>{user.username}</td>
            <td>{user.full_name}</td>
            <td>{user.email}</td>
            <td>
                <div className="user-storage">
                    <span>{user.used_storage_gb} GB / {user.storage_quota_gb} GB</span>
                    <div className="user-storage-bar">
                        <div 
                            className="user-storage-fill" 
                            style={{ width: `${user.storage_usage_percent}%` }}
                        />
                    </div>
                </div>
            </td>
            <td>
                <span className={`user-badge ${user.is_admin ? 'admin' : 'regular'}`}>
                    {user.is_admin ? 'Админ' : 'Пользователь'}
                </span>
            </td>
            <td>{new Date(user.created_at).toLocaleDateString('ru-RU')}</td>
            <td className="user-actions">
                <Button variant="secondary" size="sm" onClick={handleEdit}>
                    ✏️
                </Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>
                    🗑️
                </Button>
            </td>
        </tr>
    );
};

export default UserItem;