import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        onClose();
    };

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="sidebar-overlay" onClick={onClose}>
            <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">☁️</span>
                        <span className="logo-text">My Cloud</span>
                    </div>
                    <button className="sidebar-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="sidebar-content">
                    {isAuthenticated ? (
                        <div className="sidebar-section">
                            <div className="sidebar-user">
                                <div className="user-avatar">
                                    {user?.username?.[0]?.toUpperCase() || '👤'}
                                </div>
                                <div className="user-info">
                                    <div className="user-name">{user?.username}</div>
                                    <div className="user-role">
                                        {user?.is_admin ? 'Администратор' : 'Пользователь'}
                                    </div>
                                </div>
                            </div>

                            <nav className="sidebar-nav">
                                <button 
                                    className="sidebar-nav-item" 
                                    onClick={() => handleNavigation('/files')}
                                >
                                    <span className="nav-icon">📁</span>
                                    <span className="nav-text">Файлы</span>
                                </button>
                                
                                {user?.is_admin && (
                                    <button 
                                        className="sidebar-nav-item" 
                                        onClick={() => handleNavigation('/admin')}
                                    >
                                        <span className="nav-icon">👥</span>
                                        <span className="nav-text">Админка</span>
                                    </button>
                                )}
                            </nav>

                            <div className="sidebar-footer">
                                <ThemeToggle />
                                <Button 
                                    variant="secondary" 
                                    fullWidth 
                                    onClick={handleLogout}
                                    className="sidebar-logout-btn"
                                >
                                    Выйти
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="sidebar-auth">
                            <Button 
                                variant="primary" 
                                fullWidth 
                                onClick={() => handleNavigation('/register')}
                            >
                                Регистрация
                            </Button>
                            <Button 
                                variant="secondary" 
                                fullWidth 
                                onClick={() => handleNavigation('/login')}
                            >
                                Войти
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;