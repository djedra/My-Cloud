import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../../store/slices/authSlice';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import './AuthForm.css';

const RegisterForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        // Валидация логина
        if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(formData.username)) {
            newErrors.username = 'Логин должен начинаться с буквы, содержать только латинские буквы и цифры, длина от 4 до 20 символов';
        }

        // Валидация имени
        if (!formData.full_name || formData.full_name.length < 2) {
            newErrors.full_name = 'Полное имя должно содержать минимум 2 символа';
        }

        // Валидация email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Некорректный формат email';
        }

        // Валидация пароля
        if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = 'Пароль должен содержать хотя бы одну цифру';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
            newErrors.password = 'Пароль должен содержать хотя бы один специальный символ';
        }

        // Проверка совпадения паролей
        if (formData.password !== formData.password2) {
            newErrors.password2 = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        const result = await dispatch(register(formData));
        setIsLoading(false);
        
        if (register.fulfilled.match(result)) {
            navigate('/files');
        } else {
            // Обработка ошибок от сервера
            if (result.payload?.username) {
                setErrors({ username: result.payload.username[0] });
            }
            if (result.payload?.email) {
                setErrors({ email: result.payload.email[0] });
            }
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Очищаем ошибку для этого поля
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form-card">
                <h2 className="auth-form-title">Регистрация</h2>
                <p className="auth-form-subtitle">Создайте аккаунт для доступа к облачному хранилищу</p>
                
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username">Логин *</label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            placeholder="john_doe"
                        />
                        {errors.username && (
                            <Alert type="error" message={errors.username} />
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="full_name">Полное имя *</label>
                        <Input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleChange}
                            error={errors.full_name}
                            placeholder="Иван Иванов"
                        />
                        {errors.full_name && (
                            <Alert type="error" message={errors.full_name} />
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <Alert type="error" message={errors.email} />
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль *</label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <Alert type="error" message={errors.password} />
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password2">Подтвердите пароль *</label>
                        <Input
                            id="password2"
                            name="password2"
                            type="password"
                            value={formData.password2}
                            onChange={handleChange}
                            error={errors.password2}
                            placeholder="••••••••"
                        />
                        {errors.password2 && (
                            <Alert type="error" message={errors.password2} />
                        )}
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Зарегистрироваться
                    </Button>
                </form>

                <div className="auth-form-footer">
                    <p>
                        Уже есть аккаунт?{' '}
                        <a href="/login" className="auth-link">
                            Войти
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;