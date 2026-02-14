import React from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from '../ui/ProgressBar';
import './StorageUsage.css';

const StorageUsage = () => {
    const { user } = useSelector(state => state.auth);
    
    if (!user) return null;
    
    const usedGB = user.used_storage_gb || 0;
    const quotaGB = user.storage_quota_gb || 5;
    const percentage = user.storage_usage_percent || 0;
    
    const getStatusColor = () => {
        if (percentage < 50) return 'success';
        if (percentage < 80) return 'warning';
        return 'danger';
    };

    return (
        <div className="storage-usage-card">
            <div className="storage-usage-header">
                <h3 className="storage-usage-title">Хранилище</h3>
                <span className={`storage-usage-status status-${getStatusColor()}`}>
                    {getStatusColor() === 'success' && '✅'}
                    {getStatusColor() === 'warning' && '⚠️'}
                    {getStatusColor() === 'danger' && '❗'}
                </span>
            </div>
            
            <div className="storage-usage-stats">
                <div className="storage-usage-value">
                    {usedGB.toFixed(2)} GB / {quotaGB.toFixed(2)} GB
                </div>
                <ProgressBar value={percentage} label={`${percentage.toFixed(1)}% использовано`} />
            </div>
            
            {percentage >= 90 && (
                <div className="storage-usage-warning">
                    ⚠️ Хранилище почти заполнено! Рассмотрите возможность удаления ненужных файлов.
                </div>
            )}
        </div>
    );
};

export default StorageUsage;