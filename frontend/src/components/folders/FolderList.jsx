import React from 'react';
import FolderItem from './FolderItem';
import './FolderList.css';

const FolderList = ({ folders, currentFolder, onFolderClick }) => {
    // ЗАЩИТА: преобразуем в массив, если это не массив
    const folderArray = Array.isArray(folders) ? folders : [];
    
    // Фильтруем только корневые папки или папки текущей директории
    const filteredFolders = folderArray.filter(folder => {
        if (!currentFolder) {
            return folder.parent === null;
        }
        return folder.parent?.id === currentFolder.id;
    });

    if (filteredFolders.length === 0) {
        return (
            <div className="folder-list-empty">
                <p>Папки отсутствуют</p>
            </div>
        );
    }

    return (
        <div className="folder-list">
            {filteredFolders.map((folder) => (
                <FolderItem
                    key={folder.id}
                    folder={folder}
                    isActive={currentFolder?.id === folder.id}
                    onClick={() => onFolderClick(folder)}
                />
            ))}
        </div>
    );
};

export default FolderList;