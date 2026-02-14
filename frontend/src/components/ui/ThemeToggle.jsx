import React, { useState, useEffect } from 'react';
import Button from './Button';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        <Button
            variant="secondary"
            size="sm"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
        >
            {isDark ? '☀️' : '🌙'}
        </Button>
    );
};

export default ThemeToggle;