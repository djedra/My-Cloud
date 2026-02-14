import React, { useState } from 'react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ShareModal from './ShareModal';
import './FileItem.css';

const FileItem = ({ file, onDelete, onRename, onTogglePublic }) => {
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [newName, setNewName] = useState(file.original_name);

    const handleRenameSubmit = (e) => {
        e.preventDefault();
        onRename(file.id, newName);
        setShowRenameModal(false);
    };

    const getFileIcon = () => {
        if (file.mime_type.startsWith('image/')) return '🖼️';
        if (file.mime_type.startsWith('video/')) return '🎬';
        if (file.mime_type.startsWith('audio/')) return '🎵';
        if (file.mime_type.includes('pdf')) return '📄';
        if (file.mime_type.includes('word')) return '📝';
        if (file.mime_type.includes('excel')) return '📊';
        if (file.mime_type.includes('zip')) return '📦';
        return '📁';
    };

    const getDownloadUrl = () => {
        return `${process.env.REACT_APP_API_URL}/storage/files/${file.id}/download/`;
    };

    return (
        <tr className="file-item">
            <td className="file-info">
                <div className="file-icon">{getFileIcon()}</div>
                <div className="file-details">
                    <div className="file-name">{file.original_name}</div>
                    <div className="file-meta">
                        {file.comment && <span className="file-comment">💬 {file.comment}</span>}
                        {file.is_public && <span className="file-public">🌐 Публичный</span>}
                    </div>
                </div>
            </td>
            <td className="file-size">{file.size_formatted}</td>
            <td className="file-date">{file.uploaded_at_formatted}</td>
            <td className="file-downloads">{file.download_count}</td>
            <td className="file-actions">
                <a href={getDownloadUrl()} className="action-btn" download>
                    ⬇️
                </a>
                <button 
                    className="action-btn" 
                    onClick={() => setShowShareModal(true)}
                    title="Поделиться"
                >
                    🔗
                </button>
                <button 
                    className="action-btn" 
                    onClick={() => {
                        setNewName(file.original_name);
                        setShowRenameModal(true);
                    }}
                    title="Переименовать"
                >
                    ✏️
                </button>
                <button 
                    className="action-btn" 
                    onClick={() => onTogglePublic(file.id)}
                    title={file.is_public ? "Сделать приватным" : "Сделать публичным"}
                >
                    {file.is_public ? '🔒' : '🔓'}
                </button>
                <button 
                    className="action-btn danger" 
                    onClick={() => onDelete(file.id)}
                    title="Удалить"
                >
                    🗑️
                </button>
            </td>

            {/* Модальное окно переименования */}
            <Modal
                isOpen={showRenameModal}
                onClose={() => setShowRenameModal(false)}
                title="Переименовать файл"
            >
                <form onSubmit={handleRenameSubmit}>
                    <div className="form-group">
                        <label htmlFor="newName">Новое имя файла</label>
                        <input
                            id="newName"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="modal-input"
                            autoFocus
                        />
                    </div>
                    <div className="modal-actions">
                        <Button type="button" variant="secondary" onClick={() => setShowRenameModal(false)}>
                            Отмена
                        </Button>
                        <Button type="submit" variant="primary">
                            Сохранить
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Модальное окно шеринга */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                file={file}
            />
        </tr>
    );
};

export default FileItem;