import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, uploadFile, deleteFile, renameFile, toggleFilePublic } from '../store/slices/filesSlice';
import { fetchFolders } from '../store/slices/foldersSlice';
import FileList from '../components/files/FileList';
import FileUpload from '../components/files/FileUpload';
import StorageUsage from '../components/files/StorageUsage';
import FolderList from '../components/folders/FolderList';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import './FilesPage.css';

const FilesPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { files, loading: filesLoading } = useSelector(state => state.files);
    // ИСПРАВЛЕНО: добавлено значение по умолчанию []
    const { folders = [], loading: foldersLoading } = useSelector(state => state.folders);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        dispatch(fetchFiles({ folder_id: currentFolder?.id }));
        dispatch(fetchFolders());
    }, [dispatch, currentFolder]);

    const handleFolderClick = (folder) => {
        setCurrentFolder(folder);
    };

    const handleBackClick = () => {
        setCurrentFolder(currentFolder?.parent || null);
    };

    const handleFileUpload = async (formData) => {
        if (currentFolder) {
            formData.append('folder_id', currentFolder.id);
        }
        
        const result = await dispatch(uploadFile(formData));
        if (uploadFile.fulfilled.match(result)) {
            setShowUploadModal(false);
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
            await dispatch(deleteFile(fileId));
        }
    };

    const handleRenameFile = async (fileId, newName) => {
        await dispatch(renameFile({ fileId, newName }));
    };

    const handleTogglePublic = async (fileId) => {
        await dispatch(toggleFilePublic(fileId));
    };

    return (
        <div className="files-page">
            <div className="files-header">
                <div className="files-header-left">
                    <h1 className="files-title">Мои файлы</h1>
                    {currentFolder && (
                        <div className="files-path">
                            <button onClick={handleBackClick} className="path-btn">
                                ← Назад
                            </button>
                            <span className="path-separator">/</span>
                            <span className="path-folder">{currentFolder.name}</span>
                        </div>
                    )}
                </div>
                
                <div className="files-header-right">
                    <StorageUsage />
                    <Button
                        variant="primary"
                        onClick={() => setShowUploadModal(true)}
                    >
                        + Загрузить файл
                    </Button>
                </div>
            </div>

            <div className="files-content">
                <div className="files-sidebar">
                    <h3 className="sidebar-title">Папки</h3>
                    <FolderList
                        folders={folders}
                        currentFolder={currentFolder}
                        onFolderClick={handleFolderClick}
                    />
                </div>

                <div className="files-main">
                    {filesLoading ? (
                        <div className="loading-container">
                            <div className="spinner"></div>
                            <p>Загрузка файлов...</p>
                        </div>
                    ) : (
                        <FileList
                            files={files}
                            onDelete={handleDeleteFile}
                            onRename={handleRenameFile}
                            onTogglePublic={handleTogglePublic}
                            currentFolder={currentFolder}
                        />
                    )}
                </div>
            </div>

            <Modal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                title="Загрузить файл"
            >
                <FileUpload onUpload={handleFileUpload} />
            </Modal>
        </div>
    );
};

export default FilesPage;