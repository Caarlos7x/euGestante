import { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { theme, GlobalStyles } from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/pages/Login';
import { MyProfile } from '@/pages/MyProfile';
import { Home } from '@/pages/Home';
import { MyNotes } from '@/pages/MyNotes';
import { registerServiceWorker } from '@/utils/serviceWorker';

function App() {
  // Registrar Service Worker na inicialização
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/myprofile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-notes"
              element={
                <ProtectedRoute>
                  <MyNotes />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
