// deno-lint-ignore-file require-await
import { serve } from "./deps.ts";
import { sendTextMessage } from "./service.ts";
import {
  checkWxPushSign,
  decodeWxMsg,
  getXmlTag,
  parseXmlMessage,
} from "./utils.ts";
import * as wxConfig from "./wx-config.ts";

const sendTokenPath = "/" + wxConfig.SEND_TOKEN;
serve(async (request: Request): Promise<Response> => {
  const url = new URL(request.url);
  if (url.pathname == sendTokenPath) {
    return sendMessage(request, wxConfig.SEND_TOKEN);
  }

  if (url.pathname == "/send") {
    return sendMessage(request, url.searchParams.get("token") ?? "");
  }

  if (url.pathname == "/wx-callback") {
    if (request.method == "GET") {
      return onServerRegister(request);
    }
    if (request.method == "POST") {
      return onReceiveMessage(request);
    }
    return new Response("Method Not Allowed", { status: 405 });
  }
  // TODO 添加其他自定义处理

  return new Response("Not Found", { status: 404 });
});

async function onServerRegister(request: Request): Promise<Response> {
  console.log("[onServerRegister] url=", request.url);
  const { searchParams } = new URL(request.url);
  const msg_encrypt = searchParams.get("echostr") ?? "";
  if (checkWxPushSign(wxConfig.AGENT_TOKEN, searchParams, msg_encrypt)) {
    console.log("[onServerRegister] check signature success");
    const decoded = decodeWxMsg(
      wxConfig.AGENT_AES_KEY,
      msg_encrypt,
    );
    return new Response(decoded.message);
  } else {
    console.log("[onServerRegister] check signature fail");
    return new Response("check signature fail", { status: 400 });
  }
}

async function onReceiveMessage(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const body = await request.text();
  const msg_encrypt = getXmlTag(body, "Encrypt");
  if (checkWxPushSign(wxConfig.AGENT_TOKEN, searchParams, msg_encrypt)) {
    console.log("[onReceiveMessage] check signature success");
    const decoded = decodeWxMsg(
      wxConfig.AGENT_AES_KEY,
      msg_encrypt,
    );
    const message = parseXmlMessage(decoded.message);
    console.log(message);
    return new Response("success");
  } else {
    console.log("[onReceiveMessage] check signature fail");
    return new Response("check signature fail", { status: 400 });
  }
}

async function sendMessage(request: Request, token: string): Promise<Response> {
  const { searchParams } = new URL(request.url);

  if (token != wxConfig.SEND_TOKEN) {
    return new Response("Unauthorized", { status: 401 });
  }
  let message: string;
  if (request.method == "POST") {
    message = await request.text();
  } else {
    message = searchParams.get("message") ??
      searchParams.get("content") ??
      "";
  }
  if (message.length == 0) {
    return new Response("Empty Message", { status: 400 });
  }
  return sendTextMessage(message);
}
