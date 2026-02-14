import React from 'react';
import './Button.css';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false, 
    loading = false, 
    disabled = false, 
    onClick, 
    type = 'button',
    className = ''
}) => {
    const baseClasses = 'btn';
    const variantClasses = `btn-${variant}`;
    const sizeClasses = `btn-${size}`;
    const widthClasses = fullWidth ? 'btn-full-width' : '';
    
    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
            onClick={onClick}
            disabled={disabled || loading}
        >
            {loading ? (
                <span className="btn-loading">
                    <span className="spinner"></span>
                </span>
            ) : children}
        </button>
    );
};

export default Button;