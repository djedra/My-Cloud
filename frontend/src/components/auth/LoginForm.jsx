import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import './AuthForm.css';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        setIsLoading(true);
        const result = await dispatch(login(formData));
        setIsLoading(false);
        
        if (login.fulfilled.match(result)) {
            navigate('/files');
        } else {
            setError(result.payload?.error || 'Неверные учетные данные');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-card">
                <h2 className="auth-form-title">Вход</h2>
                <p className="auth-form-subtitle">Войдите в свой аккаунт</p>
                
                {error && (
                    <Alert type="error" message={error} />
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Логин *</label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="john_doe"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль *</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Войти
                    </Button>
                </form>

                <div className="auth-form-footer">
                    <p>
                        Нет аккаунта?{' '}
                        <a href="/register" className="auth-link">
                            Зарегистрироваться
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;