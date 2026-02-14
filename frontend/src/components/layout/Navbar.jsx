import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleLogoClick = () => {
        navigate(isAuthenticated ? '/files' : '/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <button className="navbar-menu-btn" onClick={toggleSidebar}>
                        ☰
                    </button>
                    <div className="navbar-logo" onClick={handleLogoClick}>
                        <span className="logo-icon">☁️</span>
                        <span className="logo-text">My Cloud</span>
                    </div>
                </div>

                <div className="navbar-center">
                    {isAuthenticated && (
                        <div className="navbar-links">
                            <Link to="/files" className="navbar-link">
                                📁 Файлы
                            </Link>
                            {user?.is_admin && (
                                <Link to="/admin" className="navbar-link">
                                    👥 Админка
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                <div className="navbar-right">
                    <ThemeToggle />
                    
                    {isAuthenticated ? (
                        <div className="navbar-user">
                            <div className="user-info">
                                <span className="user-name">{user?.username}</span>
                                <span className="user-role">
                                    {user?.is_admin ? 'Администратор' : 'Пользователь'}
                                </span>
                            </div>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                Выйти
                            </Button>
                        </div>
                    ) : (
                        <div className="navbar-auth">
                            <Link to="/login">
                                <Button variant="secondary" size="sm">
                                    Войти
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">
                                    Регистрация
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;