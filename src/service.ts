import {
  AccessToken,
  checkAccessToken,
  isAccessTokenValidate,
} from "./access_token.ts";
import * as wxApi from "./wx-api.ts";

const accessToken: AccessToken = {
  access_token: "",
  expireat: 0,
};

export async function sendTextMessage(content: string) {
  await requireAccessToken();
  if (!checkAccessToken(accessToken)) {
    return new Response("Access Token", { status: 403 });
  }
  return wxApi.sendTextMessageApi(accessToken.access_token, content);
}

export async function requireAccessToken() {
  if (isAccessTokenValidate(accessToken)) {
    return;
  }

  console.log("[requireAccessToken] isAccessTokenValidate = false");
  console.log("[requireAccessToken] get token from api");
  const result = await wxApi.getAccessTokenApi();

  if (result != undefined) {
    console.log("[requireAccessToken] get token success");
    accessToken.access_token = result.access_token;
    accessToken.expireat = result.expireat;
  } else {
    console.log("[requireAccessToken] get token fail");
  }
  return result;
}
