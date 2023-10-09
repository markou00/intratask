import { AccountInfo } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';
import { addClaimsToStorage } from './storageUtils';

//TODO:FIX TYPE ISSUES & AVOID THE USE OF 'any'

/**
 * This method parses WWW-Authenticate authentication headers
 * @param header
 * @return {Object} challengeMap
 */
export const parseChallenges = (header: any) => {
  const schemeSeparator = header.indexOf(' ');
  const challenges = header.substring(schemeSeparator + 1).split(',');
  const challengeMap = {};

  challenges.forEach((challenge: any) => {
    const [key, value] = challenge.split('=');
    // @ts-ignore
    challengeMap[key.trim()] = window.decodeURI(value.replace(/['"]+/g, ''));
  });

  return challengeMap;
};

/**
 * This method inspects the HTTPS response from a fetch call for the "www-authenticate header"
 * If present, it grabs the claims challenge from the header and store it in the localStorage
 * For more information, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/claims-challenge#claims-challenge-header-format
 * @param {Object} response
 * @param {string} apiEndpoint
 * @param {AccountInfo} account
 * @returns response
 */
export const handleClaimsChallenge = async (
  response: any,
  apiEndpoint: string,
  account: AccountInfo
) => {
  if (response.status === 200) {
    return response.json();
  }

  if (response.status === 401) {
    if (response.headers.get('WWW-Authenticate')) {
      const authenticateHeader = response.headers.get('WWW-Authenticate');
      const claimsChallenge: any = parseChallenges(authenticateHeader);

      /**
       * This method stores the claim challenge to the session storage in the browser to be used when
       * acquiring a token. To ensure that we are fetching the correct claim from the storage, we are
       * using the clientId of the application and oid (user’s object id) as the key identifier of
       * the claim with schema cc.<clientId>.<oid>.<resource.hostname>
       */
      if (account.idTokenClaims) {
        addClaimsToStorage(
          claimsChallenge.claims,
          `cc.${msalConfig.auth.clientId}.${account.idTokenClaims.oid}.${
            new URL(apiEndpoint).hostname
          }`
        );
      }

      const err = new Error('A claims challenge has occurred');
      err.name = 'ClaimsChallengeAuthError';
      throw err;
    }

    throw new Error(`Unauthorized: ${response.status}`);
  } else {
    throw new Error(`Something went wrong with the request: ${response.status}`);
  }
};
