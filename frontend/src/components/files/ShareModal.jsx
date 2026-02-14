import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, file }) => {
    const shareUrl = file.share_url 
        ? `${window.location.origin}/share/${file.share_url.split('/')[2]}`
        : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        alert('Ссылка скопирована в буфер обмена!');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Поделиться файлом"
        >
            <div className="share-modal-content">
                <div className="share-info">
                    <div className="share-file-icon">📄</div>
                    <div className="share-file-name">{file.original_name}</div>
                </div>

                <div className="share-url-section">
                    <label>Публичная ссылка:</label>
                    <div className="share-url-container">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="share-url-input"
                        />
                        <Button onClick={handleCopy} variant="secondary" size="sm">
                            Копировать
                        </Button>
                    </div>
                </div>

                <div className="share-privacy">
                    <div className="privacy-status">
                        <span className={`privacy-icon ${file.is_public ? 'public' : 'private'}`}>
                            {file.is_public ? '🌐' : '🔒'}
                        </span>
                        <span className="privacy-text">
                            {file.is_public ? 'Публичный доступ' : 'Приватный файл'}
                        </span>
                    </div>
                    <p className="privacy-description">
                        {file.is_public 
                            ? 'Файл доступен по ссылке без авторизации'
                            : 'Сначала сделайте файл публичным для получения ссылки'}
                    </p>
                </div>
            </div>

            <div className="modal-footer">
                <Button variant="secondary" onClick={onClose}>
                    Закрыть
                </Button>
            </div>
        </Modal>
    );
};

export default ShareModal;