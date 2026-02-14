import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import './NotFoundPage.css';

const NotFoundPage = () => {
    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="not-found-icon">404</div>
                    <h1 className="not-found-title">Страница не найдена</h1>
                    <p className="not-found-description">
                        К сожалению, запрашиваемая страница не существует или была удалена.
                    </p>
                    
                    <div className="not-found-actions">
                        <Link to="/">
                            <Button variant="primary" size="lg">
                                На главную
                            </Button>
                        </Link>
                        <Link to="/files">
                            <Button variant="secondary" size="lg">
                                К файлам
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;