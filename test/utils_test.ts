import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { checkWxPushSign, decodeWxMsg, getXmlTag } from "../src/utils.ts";

Deno.test({
  name: "Test checkWxPushSign verify",
  fn() {
    const token = "0hhAxYsnA5GBvGoZ1OEz";
    const searchParams = new URLSearchParams(
      "msg_signature=857a5ba553a46dcc19665557e998e80ee9e096f1&timestamp=1688142587&nonce=1688178440&echostr=y6hFzi0T6WdDpbwVwWD8BbjcqAHARkz2LPBTQlPogGiDLyT5JHqaIOw8q7q6SHUWIC4qnx672DWFXQbIrl8xDw%3D%3D",
    );
    const msg_encrypt = searchParams.get("echostr") ?? "";
    const result = checkWxPushSign(token, searchParams, msg_encrypt);
    assertEquals(result, true);
  },
});

Deno.test({
  name: "Test checkWxPushSign message",
  fn() {
    // https://developer.work.weixin.qq.com/document/path/90968#%E4%B8%BE%E4%BE%8B%E8%AF%B4%E6%98%8E
    const token = "QDG6eK";
    const searchParams = new URLSearchParams(
      "msg_signature=477715d11cdb4164915debcba66cb864d751f3e6&timestamp=1409659813&nonce=1372623149",
    );
    const msg_encrypt =
      "RypEvHKD8QQKFhvQ6QleEB4J58tiPdvo+rtK1I9qca6aM/wvqnLSV5zEPeusUiX5L5X/0lWfrf0QADHHhGd3QczcdCUpj911L3vg3W/sYYvuJTs3TUUkSUXxaccAS0qhxchrRYt66wiSpGLYL42aM6A8dTT+6k4aSknmPj48kzJs8qLjvd4Xgpue06DOdnLxAUHzM6+kDZ+HMZfJYuR+LtwGc2hgf5gsijff0ekUNXZiqATP7PF5mZxZ3Izoun1s4zG4LUMnvw2r+KqCKIw+3IQH03v+BCA9nMELNqbSf6tiWSrXJB3LAVGUcallcrw8V2t9EL4EhzJWrQUax5wLVMNS0+rUPA3k22Ncx4XXZS9o0MBH27Bo6BpNelZpS+/uh9KsNlY6bHCmJU9p8g7m3fVKn28H3KDYA5Pl/T8Z1ptDAVe0lXdQ2YoyyH2uyPIGHBZZIs2pDBS8R07+qN+E7Q==";
    const result = checkWxPushSign(token, searchParams, msg_encrypt);
    assertEquals(result, true);
  },
});

Deno.test({
  name: "Test decodeWxMsg",
  fn() {
    const encodingAesKey = "jWmYm7qr5nMoAUwZRjGtBxmz3KA1tkAj3ykkR6q2B2C";
    const msg_encrypt =
      "bdsiKf5xpTluTvmnur12h1WJuZFeR4UKpinbuIhhVCv1HU0t4qa9Y0PHAcx7IZ39Rk9SHKmip6mZaodwN6jYvQ==";
    const result = decodeWxMsg(encodingAesKey, msg_encrypt);
    assertEquals(result.message, "4878659104446300119");
  },
});

Deno.test({
  name: "Test getXmlTag",
  fn() {
    const xml =
      `<xml><ToUserName><![CDATA[wx5823bf96d3bd56c7]]></ToUserName><Encrypt><![CDATA[<xml>nested</xml>]]></Encrypt><AgentID><![CDATA[218]]></AgentID></xml>`;
    assertEquals(getXmlTag(xml, "Encrypt"), "<xml>nested</xml>");
    assertEquals(getXmlTag(xml, "ToUserName"), "wx5823bf96d3bd56c7");
    assertEquals(getXmlTag(xml, "AgentID"), "218");
  },
});
