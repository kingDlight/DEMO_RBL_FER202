import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/index';
import './index.css';
// @ts-ignore
import '@heroui/styles/css';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { PlayerProvider } from './context/PlayerContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ToastProvider } from './context/ToastContext.tsx';
import { UserProvider } from './context/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <UserProvider>
              <ThemeProvider>
                <PlayerProvider>
                  <App />
                </PlayerProvider>
              </ThemeProvider>
            </UserProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
