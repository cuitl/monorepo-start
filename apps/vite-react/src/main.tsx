import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { sayHello } from '@vue-start-monorepo/shared';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

sayHello();
