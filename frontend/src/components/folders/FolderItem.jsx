import React from 'react';
import './FolderItem.css';

const FolderItem = ({ folder, isActive, onClick }) => {
    return (
        <div 
            className={`folder-item ${isActive ? 'folder-item-active' : ''}`}
            onClick={onClick}
        >
            <div className="folder-icon">📁</div>
            <div className="folder-info">
                <div className="folder-name">{folder.name}</div>
                <div className="folder-meta">
                    {folder.file_count || 0} файлов
                </div>
            </div>
        </div>
    );
};

export default FolderItem;