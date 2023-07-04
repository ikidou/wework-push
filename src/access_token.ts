import { now } from "./utils.ts";

export function isAccessTokenValidate(appToken: AccessToken | undefined) {
  return checkAccessToken(appToken) != undefined;
}

export function checkAccessToken(appToken: AccessToken | undefined) {
  if (appToken == undefined) return undefined;
  if (appToken.access_token.length == 0) return undefined;
  if (appToken.expireat <= now() + 60) return undefined;
  return appToken;
}

export interface AccessToken {
  access_token: string;
  expireat: number;
}
