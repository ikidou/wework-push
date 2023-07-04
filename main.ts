// deno-lint-ignore-file require-await
import { serve } from "./deps.ts";
import { sendTextMessage } from "./service.ts";
import {
  checkWxPushSign,
  decodeWxMsg,
  getXmlTag,
  parseXmlMessage,
} from "./utils.ts";
import wxWorkConfig from "./wework-config.ts";

async function onServerRegister(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const msg_encrypt = searchParams.get("echostr") ?? "";
  if (checkWxPushSign(wxWorkConfig.AGENT_TOKEN, searchParams, msg_encrypt)) {
    console.log("check signature success");
    return new Response(searchParams.get("echostr"));
  } else {
    console.log("check signature fail");
    return new Response("check signature fail", { status: 400 });
  }
}

async function onReceiveMessage(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const body = await request.text();
  const msg_encrypt = getXmlTag(body, "Encrypt");
  if (checkWxPushSign(wxWorkConfig.AGENT_TOKEN, searchParams, msg_encrypt)) {
    console.log("check signature success");
    const decoded = decodeWxMsg(
      wxWorkConfig.AGENT_ENCODING_AES_KEY,
      msg_encrypt,
    );
    const message = parseXmlMessage(decoded.message);
    console.log(message);
    return new Response("success");
  } else {
    console.log("check signature fail");
    return new Response("check signature fail", { status: 400 });
  }
}

async function sendMessage(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get("token") ?? "";
  if (token != wxWorkConfig.APP_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }

  const message = searchParams.get("content") ?? "";
  if (message.length == 0) {
    return new Response("Empty Message", { status: 400 });
  }
  return sendTextMessage(message);
}

serve(async (request: Request): Promise<Response> => {
  const url = new URL(request.url);

  if (url.pathname == "/send") {
    return sendMessage(request);
  }

  if (url.pathname == "/wework") {
    if (request.method == "GET") {
      return onServerRegister(request);
    }
    if (request.method == "POST") {
      return onReceiveMessage(request);
    }
    return new Response("Method Not Allowed", { status: 405 });
  }

  return new Response("Not Found", { status: 404 });
});
