import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import { Router } from './pages';
import { LanguageProvider } from './helpers';

import './assets/css/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LanguageProvider>
      <Router />
    </LanguageProvider>
  </BrowserRouter>
);

