# 使用 Deno Deploy

## 登录并部署项目

1）fork 本项目

2）使用Github 登录 Deno Deploy

打开 [Deno Deploy 官网](https://dash.deno.com/login?redirect=%2Fprojects)

点击 【Continue with Github】 完成登录

![注册](/assets/deno-deploy-1.png)

3）点击【New Project】

![创建项目](/assets/deno-deploy-2.png)

4）点击【Select a repository】

![创建项目1](/assets/deno-deploy-3.png)

5）填写基本信息

参照下图配置，仓库选择你刚刚fork的仓库

![项目配置](/assets/deno-deploy-4.png)

点击 【Create & Deploy】完成项目创建

![项目创建完成](/assets/deno-deploy-5.png)

## 环境变量配置

完成以上操作后，此时项目无法运行，因为缺少必要的环境变量，如果你之前没有收集

7）配置环节变量并保存

![环境变量1](/assets/deno-deploy-6.png)

所需的环境变量请参考 [.env.example](/.env.example)

![环境变量2](/assets/deno-deploy-7.png)

8）在企业微信后台填写项目地址完成项目配置

比如我的项目名称是 `near-snail-48` 所以在API地址为

- 企业微信回调地址：`https://near-snail-48.deno.dev/wx-callback`
- 推送微信消息地址：`https://near-snail-48.deno.dev/send?token=${WEWORK_SEND_TOKEN}`

## 异常情况

### 错误代码60020

> {"errcode":60020,"errmsg":"not allow to access from your ip, hint:
> [1688229570612130651539009], from ip: 1.1.1.1, more info at
> https://open.work.weixin.qq.com/devtool/query?e=60020"}

这是由于调用API的服务器IP不在企业微信的可信IP里面，在企业微信管理后台添加后即可

添加方法参考 [注册&配置企业微信#企业可信IP](/docs/config-wework.md#企业可信IP)
