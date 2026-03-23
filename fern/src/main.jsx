import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/theme.css'; 

// 1. Make sure this import path is exactly right
import { UserProvider } from './context/UserContext.jsx'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Make sure UserProvider wraps App perfectly */}
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
);