import { EventType, PublicClientApplication } from '@azure/msal-browser';
import ReactDOM from 'react-dom/client';
import App from './App';
import { msalConfig } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

/**
 * To set an active account after the user signs in, register an event and listen for LOGIN_SUCCESS and LOGOUT_SUCCESS. For more,
 * visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
 */
msalInstance.addEventCallback((event: any) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }

  if (event.eventType === EventType.LOGOUT_SUCCESS) {
    if (msalInstance.getAllAccounts().length > 0) {
      msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <App msalInstance={msalInstance} />
  </>
);
