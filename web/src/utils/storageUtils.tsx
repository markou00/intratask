import { AccountInfo } from '@azure/msal-common';
import { msalConfig } from '../authConfig';

/**
 *  This method stores the claim challenge to the localStorage in the browser to be used when acquiring a token
 * @param {String} claimsChallenge
 */
export const addClaimsToStorage = (claimsChallenge: string, claimsChallengeId: string) => {
  sessionStorage.setItem(claimsChallengeId, claimsChallenge);
};

export const getClaimsFromStorage = (claimsChallengeId: string) => {
  return sessionStorage.getItem(claimsChallengeId);
};

/**
 * This method clears localStorage of any claims challenge entry
 * @param {Object} account
 */
export const clearStorage = (account: AccountInfo | null) => {
  if (account?.idTokenClaims) {
    for (var key in sessionStorage) {
      if (key.startsWith(`cc.${msalConfig.auth.clientId}.${account.idTokenClaims.oid}`))
        sessionStorage.removeItem(key);
    }
  }
};
