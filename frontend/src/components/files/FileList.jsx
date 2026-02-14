import React from 'react';
import FileItem from './FileItem';
import './FileList.css';

const FileList = ({ files, onDelete, onRename, onTogglePublic, currentFolder }) => {
    if (files.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h3 className="empty-title">
                    {currentFolder ? 'Папка пуста' : 'У вас пока нет файлов'}
                </h3>
                <p className="empty-description">
                    {currentFolder 
                        ? 'Загрузите файлы в эту папку' 
                        : 'Начните загружать файлы в ваше облачное хранилище'}
                </p>
            </div>
        );
    }

    return (
        <div className="file-list-container">
            <table className="file-table">
                <thead>
                    <tr>
                        <th>Файл</th>
                        <th>Размер</th>
                        <th>Дата загрузки</th>
                        <th>Скачиваний</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <FileItem
                            key={file.id}
                            file={file}
                            onDelete={onDelete}
                            onRename={onRename}
                            onTogglePublic={onTogglePublic}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FileList;