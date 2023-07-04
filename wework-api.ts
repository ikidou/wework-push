import { AccessToken, checkAccessToken } from "./access_token.ts";
import { now } from "./utils.ts";
import config from "./wework-config.ts";

export function getAccessTokenApi(): Promise<AccessToken | undefined> {
  return fetch(
    "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + config.CROP_ID +
      "&corpsecret=" + config.CORP_SECRET,
  )
    .then((response) => response.json())
    .then<AccessToken | undefined>((result) => {
      return checkAccessToken({
        access_token: result.access_token ?? "",
        expireat: (result.expires_in ?? 0) + now(),
      });
    })
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.log("error", error);
      return undefined;
    });
}

export function sendTextMessageApi(
  access_token: string,
  content: string,
) {
  const data = {
    "touser": config.TO_USER,
    "msgtype": "text",
    "agentid": config.AGENT_ID,
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
  return fetch(
    "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=" +
      access_token,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
      redirect: "follow",
    },
  );
}
