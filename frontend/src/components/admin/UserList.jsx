import React from 'react';
import UserItem from './UserItem';
import './UserList.css';

const UserList = ({ users }) => {
    return (
        <div className="user-list">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Логин</th>
                        <th>Полное имя</th>
                        <th>Email</th>
                        <th>Хранилище</th>
                        <th>Админ</th>
                        <th>Дата регистрации</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserItem key={user.id} user={user} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;