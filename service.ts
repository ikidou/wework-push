import {
  AccessToken,
  checkAccessToken,
  isAppTokenValidate,
} from "./access_token.ts";
import { getAccessTokenApi, sendTextMessageApi } from "./wework-api.ts";

const accessToken: AccessToken = {
  access_token: "",
  expireat: 0,
};

export async function sendTextMessage(content: string) {
  await requireAppToken();
  if (!checkAccessToken(accessToken)) {
    return new Response("Access Token", { status: 403 });
  }
  return sendTextMessageApi(accessToken.access_token, content);
}

export async function requireAppToken() {
  if (isAppTokenValidate(accessToken)) {
    console.log("[requireAppToken]isAppTokenValidate = true");
    return;
  }
  console.log("[requireAppToken] try get token from DB");

  const result = await getAccessTokenApi();

  if (result != undefined) {
    console.log("[requireAppToken] get token success");
    accessToken.access_token = result.access_token;
    accessToken.expireat = result.expireat;
  } else {
    console.log("[requireAppToken] get token fail");
  }
  return result;
}
