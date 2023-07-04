import { AccessToken, checkAccessToken } from "./access_token.ts";
import { now } from "./utils.ts";
import * as wxConfig from "./wx-config.ts";

const WX_API_GET_TOKEN = "https://qyapi.weixin.qq.com/cgi-bin/gettoken";
const WX_API_SEND_MESSAGE = "https://qyapi.weixin.qq.com/cgi-bin/message/send";

export function getAccessTokenApi(): Promise<AccessToken | undefined> {
  const url = new URL(WX_API_GET_TOKEN);
  url.searchParams.set("corpid", wxConfig.CROP_ID);
  url.searchParams.set("corpsecret", wxConfig.AGENT_SECRET);

  return fetch(url)
    .then((response) => response.json())
    .then<AccessToken | undefined>((result) => {
      return checkAccessToken({
        access_token: result.access_token ?? "",
        expireat: (result.expires_in ?? 0) + now(),
      });
    })
    .catch((error) => {
      console.log("error", error);
      return undefined;
    });
}

export function sendTextMessageApi(access_token: string, content: string) {
  const data = {
    "touser": wxConfig.SEND_TO_USER,
    "msgtype": "text",
    "agentid": wxConfig.AGENT_ID,
    "text": {
      "content": content,
    },
    "safe": 0,
    "enable_id_trans": 0,
    "enable_duplicate_check": 0,
    "duplicate_check_interval": 1800,
  };
  return _sendMessage(access_token, data);
}

function _sendMessage(access_token: string, message: Record<string, unknown>) {
  const url = new URL(WX_API_SEND_MESSAGE);
  url.searchParams.set("access_token", access_token);

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
