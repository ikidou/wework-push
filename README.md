# wework-push

企业微信推送API （基于Deno开发）

## API使用方法

### API 使用示例

```bash
curl -d "Hello" "https://localhost:8000/send?token=DEFAULT_SEND_TOKEN"
```

```bash
curl "https://localhost:8000/send?token=DEFAULT_SEND_TOKEN&message=Hello"
```

```bash
curl "https://localhost:8000/DEFAULT_SEND_TOKEN?message=Hello"
```

```bash
curl -d "Hello" "https://localhost:8000/DEFAULT_SEND_TOKEN"
```

以上几种形式在效果上完全等价

### API 参数

- `token`
  - **URL参数**(`?token=DEFAULT_SEND_TOKEN`)，取值和`${WEWORK_SEND_TOKEN}`相同
  - **API PATH**(`/DEFAULT_SEND_TOKEN`)
- `message`
  - **URL参数**:(`?message=Hello`)
  - **URL参数**:(`?content=Hello`)
  - **HTTP POST BODY CONTENT**(所有内容，无视`Content-Type`)

消息内容可以以POST方法的消息体或者用URL参数传递(`message`或者`content`)

## 部署

在部署前需要用到以下参数，请先根据[企业微信配置](/docs/config-wework.md)完成部署前准备工作

| 参数名称             | 说明                       |
| -------------------- | -------------------------- |
| WEWORK_CROP_ID       | ${企业ID}                  |
| WEWORK_AGENT_ID      | ${应用ID}                  |
| WEWORK_AGENT_SECRET  | ${应用Secret}              |
| WEWORK_AGENT_TOKEN   | ${应用TOKEN}               |
| WEWORK_AGENT_AES_KEY | ${应用AES_KEY}             |
| WEWORK_SEND_TO_USER  | 消息发送给谁，可以用`@all` |
| WEWORK_SEND_TOKEN    | 用于API验证，请自行修改    |

### 使用 Deno Deploy

[查看如何通过 "Deno Deploy" 部署](/docs/deno-deploy.md)

### Self Host

#### 使用 Docker

准备环境变量

```bash
curl -fSsLo "wework-push.env" "https://raw.githubusercontent.com/ikidou/wework-push/.env.example" && \
vim wework-push.env
```

```bash
docker run --rm --detach --env-file wework-push.env -p 127.0.0.1:8000:8000 ghcr.io/ikidou/wework-push
```

#### 使用Systemd

```bash
git clone https://github.com/ikidou/wework-push.git
cd wework-push
cp .env.example .env
# 配置环境变量文件
vim .env
sudo cp "wework-push.service" /etc/systemd/system/
sudo sed -i "s#{PATH_TO_GIT_REPO}#$(pwd)#" "/etc/systemd/system/wework-push.service"
sudo sed -i "s#{PATH_TO_DENO_BIN}#$(which deno)#" "/etc/systemd/system/wework-push.service"
sudo systemctl daemon-reload
sudo systemctl start wework-push
sudo systemctl status wework-push
```

#### 直接运行测试

```bash
git clone https://github.com/ikidou/wework-push.git
cd wework-push
cp .env.example .env
# 配置环境变量文件
vim .env
export $(grep -v '^#' .env | xargs -d '\n')
deno run --allow-net --allow-env src/main.ts
```

## 反向代理

假设你的服务器域名为 `example.com` 并希望分配路径为 `/wework-push` 则有：

- 企业微信回调地址：`https://example.com/wework-push/wx-callback`
- 推送微信消息地址：`https://example.com/wework-push/send?token=${WEWORK_SEND_TOKEN}`

下面介绍 `Caddy` 和 `Nginx` 两种服务的配置方法

**使用Caddy**

```
# 适用于和其他站点共存且分配独立的路径前缀
example.com {
    handle_path /wework-push/* {
        reverse_proxy http://127.0.0.1:8000
    }
}
```

**使用Nginx**

```
server {
    server_name example.com;
    # ....
    location /wework-push/ {
        proxy_pass http://127.0.0.1:8000/;
    }
}
```

## 企业微信配置

[查看文档](/docs/config-wework.md)
