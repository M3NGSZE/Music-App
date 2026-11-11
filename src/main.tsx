import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './app/App.tsx'
import Nagivation from './components/layout/Navigation.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Nagivation />
  </StrictMode>,
);
