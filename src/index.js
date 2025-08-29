import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importe o BrowserRouter
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolva o App com o BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);