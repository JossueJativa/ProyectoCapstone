import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import { Router } from './pages';
import { SocketProvider } from './helpers';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Router />
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
