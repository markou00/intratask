import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './routes/root';
import { ThemeProvider } from './ThemeProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
