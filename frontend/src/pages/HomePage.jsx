import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="home-container">
                <div className="home-content">
                    <h1 className="home-title">
                        My Cloud
                        <span className="home-subtitle">Облачное хранилище</span>
                    </h1>
                    
                    <p className="home-description">
                        Безопасное и удобное хранилище для ваших файлов. 
                        Доступ к файлам из любой точки мира.
                    </p>
                    
                    <div className="home-features">
                        <div className="feature-item">
                            <div className="feature-icon">🔒</div>
                            <h3>Безопасность</h3>
                            <p>Ваши файлы защищены современными методами шифрования</p>
                        </div>
                        
                        <div className="feature-item">
                            <div className="feature-icon">📱</div>
                            <h3>Доступ везде</h3>
                            <p>Доступ к файлам с любого устройства и платформы</p>
                        </div>
                        
                        <div className="feature-item">
                            <div className="feature-icon">🔄</div>
                            <h3>Синхронизация</h3>
                            <p>Автоматическая синхронизация всех ваших устройств</p>
                        </div>
                    </div>
                    
                    <div className="home-actions">
                        <Link to="/register">
                            <Button variant="primary" size="lg">
                                Начать бесплатно
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="lg">
                                Войти в аккаунт
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;