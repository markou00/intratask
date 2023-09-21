import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from '@azure/msal-react';
import { Button } from '@mantine/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { loginRequest } from './authConfig';
import Dashboard from './pages/Dashboard';

interface IApp {
  msalInstance: any;
}

export default function App({ msalInstance }: IApp) {
  const handleLoginRedirect = () => {
    msalInstance.loginRedirect(loginRequest);
  };

  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <AuthenticatedTemplate>
                    <Dashboard />
                  </AuthenticatedTemplate>
                  <UnauthenticatedTemplate>
                    <Button onClick={handleLoginRedirect}>Login</Button>
                  </UnauthenticatedTemplate>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </MsalProvider>
  );
}
