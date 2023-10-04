import { IPublicClientApplication } from '@azure/msal-browser';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { FilterProvider } from './context/FilterContext';
import Dashboard from './pages/Dashboard';
import Welcome from './pages/Welcome';

interface IApp {
  msalInstance: IPublicClientApplication;
}

const queryClient = new QueryClient();

export default function App({ msalInstance }: IApp) {
  return (
    <QueryClientProvider client={queryClient}>
      <MsalProvider instance={msalInstance}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <AuthenticatedTemplate>
                      <FilterProvider>
                        <Dashboard />
                      </FilterProvider>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                      <Welcome />
                    </UnauthenticatedTemplate>
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </MsalProvider>
    </QueryClientProvider>
  );
}
