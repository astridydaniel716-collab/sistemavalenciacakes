import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/index.css';


// Crear la raíz de la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));


// Renderizar la aplicación
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);