import { PublicClientApplication } from '@azure/msal-browser';
import ReactDOM from 'react-dom/client';
import App from './App';
import { msalConfig } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App msalInstance={msalInstance} />
  </>
);
