import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// Async thunk для получения списка пользователей
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (params, thunkAPI) => {
        try {
            return await userService.getUsers(params);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для обновления пользователя (назначение/снятие прав админа)
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ userId, userData }, thunkAPI) => {
        try {
            return await userService.updateUser(userId, userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

// Async thunk для удаления пользователя
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId, thunkAPI) => {
        try {
            await userService.deleteUser(userId);
            return userId; // Возвращаем ID удаленного пользователя для обновления состояния
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const initialState = {
    users: [],
    isLoading: false,
    error: null,
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Получение списка пользователей
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка получения пользователей' };
            })
            
            // Обновление пользователя
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Обновляем пользователя в списке
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка обновления пользователя' };
            })
            
            // Удаление пользователя
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Удаляем пользователя из списка по ID
                state.users = state.users.filter(u => u.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || { error: 'Ошибка удаления пользователя' };
            });
    },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;