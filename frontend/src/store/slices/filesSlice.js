import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from '../../services/fileService';

// Async thunk для получения списка файлов
export const fetchFiles = createAsyncThunk(
    'files/fetchFiles',
    async (params, thunkAPI) => {
        try {
            return await fileService.getFiles(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для загрузки файла
export const uploadFile = createAsyncThunk(
    'files/uploadFile',
    async (formData, thunkAPI) => {
        try {
            return await fileService.uploadFile(formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для удаления файла
export const deleteFile = createAsyncThunk(
    'files/deleteFile',
    async (fileId, thunkAPI) => {
        try {
            await fileService.deleteFile(fileId);
            return fileId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для переименования файла
export const renameFile = createAsyncThunk(
    'files/renameFile',
    async ({ fileId, newName }, thunkAPI) => {
        try {
            return await fileService.renameFile(fileId, newName);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для переключения публичного статуса
export const toggleFilePublic = createAsyncThunk(
    'files/toggleFilePublic',
    async (fileId, thunkAPI) => {
        try {
            return await fileService.togglePublic(fileId);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    files: [],
    isLoading: false,
    error: null,
};

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Получение списка файлов
        builder
            .addCase(fetchFiles.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFiles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files = action.payload;
            })
            .addCase(fetchFiles.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка получения файлов' };
            })
            // Загрузка файла
            .addCase(uploadFile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files.unshift(action.payload); // Добавляем новый файл в начало списка
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка загрузки файла' };
            })
            // Удаление файла
            .addCase(deleteFile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.files = state.files.filter(file => file.id !== action.payload);
            })
            .addCase(deleteFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка удаления файла' };
            })
            // Переименование файла
            .addCase(renameFile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(renameFile.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.files.findIndex(file => file.id === action.payload.id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            .addCase(renameFile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка переименования файла' };
            })
            // Переключение публичного статуса
            .addCase(toggleFilePublic.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(toggleFilePublic.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.files.findIndex(file => file.id === action.payload.id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            .addCase(toggleFilePublic.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка изменения статуса файла' };
            });
    },
});

export const { clearError } = filesSlice.actions;
export default filesSlice.reducer;