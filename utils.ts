import { aesCreateDecipher, base64 } from "./deps.ts";
import { Hash } from "./deps.ts";

export function now() {
  return Math.ceil(Date.now() / 1000);
}

export function sha1str(input: string): string {
  const encoder = new TextEncoder();
  return new Hash("sha1").digest(encoder.encode(input)).hex();
}

export function getXmlTag(xml: string, tag: string): string {
  const startTag = "<" + tag + ">";
  const endTag = "</" + tag + ">";
  const startTagIndex = xml.indexOf(startTag);
  if (startTagIndex < 0) return "";
  const endTagIndex = xml.indexOf(endTag, startTagIndex + startTag.length);
  if (endTagIndex < 0) throw new Error("</+ " + tag + "> EndTag Not Found");

  const tagValue = xml.substring(startTagIndex + startTag.length, endTagIndex);
  if (tagValue.startsWith("<![CDATA[") && tagValue.endsWith("]]>")) {
    return tagValue.substring(9, tagValue.length - 3);
  }
  return tagValue;
}

export function decodeWxMsg(encodingAesKey: string, msg_encrypt: string) {
  const textDecoder = new TextDecoder();
  const aseKey = base64.decode(encodingAesKey);
  const ase_msg = base64.decode(msg_encrypt);
  const decipher = aesCreateDecipher("CBC", aseKey, aseKey.slice(0, 16));
  decipher.update(ase_msg);
  const plainBytes = decipher.finish();
  const length = bytes2Int(plainBytes.slice(16, 20));
  const plainText = textDecoder.decode(plainBytes.slice(20, 20 + length));
  const receiveId = textDecoder.decode(plainBytes.slice(20 + length));
  return {
    message: plainText,
    receiveid: receiveId,
  };
}

export function checkWxPushSign(
  token: string,
  searchParams: URLSearchParams,
  msg_encrypt: string,
): boolean {
  const params = new Map<string, string>();
  for (const [key, value] of searchParams.entries()) {
    params.set(key, value);
  }
  const signature = searchParams.get("msg_signature");

  const timestamp = searchParams.get("timestamp");
  const nonce = searchParams.get("nonce");

  const tmp_token = [token, timestamp, nonce, msg_encrypt].sort()
    .join("");

  const calc_signature = sha1str(tmp_token);
  return calc_signature == signature;
}

export function parseXmlMessage(xml: string) {
  return {
    fromUserName: getXmlTag(xml, "FromUserName"),
    toUserName: getXmlTag(xml, "ToUserName"),
    createTime: getXmlTag(xml, "CreateTime"),
    msgType: getXmlTag(xml, "MsgType"),
    content: getXmlTag(xml, "Content"),
    msgId: getXmlTag(xml, "MsgId"),
    agentID: getXmlTag(xml, "AgentID"),
  };
}

export function bytes2Int(bytes: Uint8Array) {
  if (bytes.length > 4) {
    bytes = bytes.slice(bytes.length - 4, bytes.length);
  }
  let num = 0;
  for (const i of bytes) {
    num = num << 8;
    num |= i & 0xff;
  }
  return num;
}

export function int2bytes(input: number) {
  return Uint8Array.of(
    (input & 0xff000000) >>> 24,
    (input & 0x00ff0000) >>> 16,
    (input & 0x0000ff00) >>> 8,
    (input & 0x000000ff) >>> 0,
  );
}
