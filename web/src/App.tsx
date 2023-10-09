import { IPublicClientApplication } from '@azure/msal-browser';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import Layout from './components/layout/Layout';
import { FilterProvider } from './contexts/FilterContext';
import Dashboard from './pages/Dashboard';
import Deviations from './pages/Deviations';
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
            <AuthenticatedTemplate>
              <Layout />
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <FilterProvider>
                        <Dashboard />
                      </FilterProvider>
                    </>
                  }
                />
                <Route path="/deviations" element={<Deviations />} />
              </Routes>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <Welcome />
            </UnauthenticatedTemplate>
          </BrowserRouter>
        </ThemeProvider>
      </MsalProvider>
    </QueryClientProvider>
  );
}
