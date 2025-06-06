import router from './routes/routes.jsx';
import { RouterProvider } from 'react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const root = document.getElementById('root');

createRoot(root).render(
  
    <RouterProvider router={router} />

);
