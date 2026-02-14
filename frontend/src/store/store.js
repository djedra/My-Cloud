import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import filesReducer from './slices/filesSlice';
import foldersReducer from './slices/foldersSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        files: filesReducer,
        folders: foldersReducer,
        users: usersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['files/uploadFile/pending', 'files/uploadFile/fulfilled'],
                ignoredPaths: ['meta.arg', 'payload.file'],
            },
        }),
});