import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './store/store';
import './styles/main.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        {/* Добавляем флаги для устранения предупреждений */}
        <Router 
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
            }}
        >
            <App />
        </Router>
    </Provider>
);