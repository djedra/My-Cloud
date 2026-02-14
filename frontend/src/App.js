import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import FilesPage from './pages/FilesPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAuthenticated } = useSelector(state => state.auth);
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    if (adminOnly && !user?.is_admin) {
        return <Navigate to="/files" replace />;
    }
    
    return children;
};

function App() {
    const dispatch = useDispatch();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        // Загрузка темы из localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    useEffect(() => {
        // Проверка аутентификации при загрузке приложения
        if (isAuthenticated) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, isAuthenticated]);

    useEffect(() => {
        // Закрываем сайдбар при смене маршрута
        setIsSidebarOpen(false);
    }, [location]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="app">
            {isAuthenticated && (
                <>
                    <Navbar toggleSidebar={toggleSidebar} />
                    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                </>
            )}
            
            <main className={`main-content ${isAuthenticated ? 'with-navbar' : ''}`}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route
                        path="/files"
                        element={
                            <ProtectedRoute>
                                <FilesPage />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <AdminPage />
                            </ProtectedRoute>
                        }
                    />
                    
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;