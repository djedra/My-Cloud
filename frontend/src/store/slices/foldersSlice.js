import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import folderService from '../../services/folderService';

// Async thunk для получения списка папок
export const fetchFolders = createAsyncThunk(
    'folders/fetchFolders',
    async (_, thunkAPI) => {
        try {
            return await folderService.getFolders();
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для создания папки
export const createFolder = createAsyncThunk(
    'folders/createFolder',
    async (folderData, thunkAPI) => {
        try {
            return await folderService.createFolder(folderData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    folders: [],
    isLoading: false,
    error: null,
};

const foldersSlice = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Получение списка папок
        builder
            .addCase(fetchFolders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFolders.fulfilled, (state, action) => {
                state.isLoading = false;
                // ЗАЩИТА: проверяем, что получили массив
                if (Array.isArray(action.payload)) {
                    state.folders = action.payload;
                } else {
                    state.folders = [];
                    state.error = { message: 'Некорректный формат данных папок' };
                    console.error('Ошибка формата данных папок:', action.payload);
                }
            })
            .addCase(fetchFolders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка получения папок' };
            })
            // Создание папки
            .addCase(createFolder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createFolder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.folders.push(action.payload);
            })
            .addCase(createFolder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка создания папки' };
            });
    },
});

export const { clearError } = foldersSlice.actions;
export default foldersSlice.reducer;