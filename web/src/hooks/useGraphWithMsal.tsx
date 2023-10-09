import { InteractionType } from '@azure/msal-browser';
import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { ResponseType } from '@microsoft/microsoft-graph-client';
import { useCallback, useState } from 'react';

import { msalConfig } from '../configs/authConfig';
import { getGraphClient } from '../configs/graph';
import { handleClaimsChallenge } from '../utils/claimUtils';
import { getClaimsFromStorage } from '../utils/storageUtils';

//TODO:FIX TYPE ISSUES & AVOID THE USE OF 'any'

/**
 * Custom hook to call a Graph API using Graph SDK
 * @param {PopupRequest} request
 * @param {String} endpoint
 * @returns
 */
const useGraphWithMsal = (request: any, endpoint: any) => {
  const [error, setError] = useState(null);
  const { instance } = useMsal();

  const account = instance.getActiveAccount();
  const resource = new URL(endpoint).hostname;

  const claims =
    account &&
    account.idTokenClaims &&
    getClaimsFromStorage(`cc.${msalConfig.auth.clientId}.${account.idTokenClaims.oid}.${resource}`)
      ? window.atob(
          // @ts-ignore
          getClaimsFromStorage(
            `cc.${msalConfig.auth.clientId}.${account.idTokenClaims.oid}.${resource}`
          )
        )
      : undefined; // e.g {"access_token":{"xms_cc":{"values":["cp1"]}}}

  const {
    result,
    login,
    error: msalError,
  } = useMsalAuthentication(InteractionType.Popup, {
    ...request,
    redirectUri: '/redirect',
    account: account,
    claims: claims,
  });

  /**
   * Execute a fetch request with Graph SDK
   * @param {String} endpoint
   * @returns JSON response
   */
  const execute = async (endpoint: string) => {
    if (msalError) {
      // @ts-ignore
      setError(msalError);
      return;
    }

    if (result) {
      let accessToken = result.accessToken;

      try {
        const graphResponse = await getGraphClient(accessToken)
          .api(endpoint)
          .responseType(ResponseType.RAW)
          .get();

        const responseHasClaimsChallenge = await handleClaimsChallenge(
          graphResponse,
          endpoint,
          //@ts-ignore
          account
        );
        return responseHasClaimsChallenge;
      } catch (error: any) {
        if (error.name === 'ClaimsChallengeAuthError') {
          login(InteractionType.Redirect, request);
        } else {
          setError(error);
        }
      }
    }
  };

  return {
    error,
    result: result,
    execute: useCallback(execute, [result, msalError]),
  };
};

export default useGraphWithMsal;
