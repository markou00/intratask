import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './ThemeProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
