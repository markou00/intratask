import { EventType, PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { msalConfig } from "configs/authConfig";
import { AppProps } from "next/app";
import Head from "next/head";
import { theme } from "../theme";

export default function App(props: AppProps) {
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

  const { Component, pageProps } = props;
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <title>IntraTask | Avviksystem</title>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MsalProvider instance={msalInstance}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <ModalsProvider>
              <Component {...pageProps} />
            </ModalsProvider>
          </MantineProvider>
        </QueryClientProvider>
      </MsalProvider>
    </>
  );
}
