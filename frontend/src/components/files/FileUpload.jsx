import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import './FileUpload.css';

const FileUpload = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile) {
            alert('Пожалуйста, выберите файл');
            return;
        }
        
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('comment', comment);
        
        await onUpload(formData);
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="file-upload-form">
            <div className="form-group">
                <label htmlFor="file" className="file-label">
                    <div className="file-input-container">
                        {selectedFile ? (
                            <div className="file-selected">
                                <span className="file-icon">📁</span>
                                <span className="file-name">{selectedFile.name}</span>
                                <span className="file-size">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </span>
                            </div>
                        ) : (
                            <div className="file-placeholder">
                                <span className="file-icon">⬆️</span>
                                <p>Перетащите файл сюда или нажмите для выбора</p>
                                <p className="file-hint">Поддерживаются все форматы файлов</p>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </label>
            </div>

            <div className="form-group">
                <label htmlFor="comment">Комментарий</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Добавьте комментарий к файлу (необязательно)"
                    className="comment-input"
                    rows="3"
                />
            </div>

            <div className="form-actions">
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading || !selectedFile}
                >
                    {isLoading ? 'Загрузка...' : 'Загрузить файл'}
                </Button>
            </div>
        </form>
    );
};

export default FileUpload;