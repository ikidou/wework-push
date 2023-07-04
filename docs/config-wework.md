# 注册&配置企业微信

## 创建并登录企业微信

[查看注册官方文档](https://open.work.weixin.qq.com/wwopen/manual/detail?t=register)

## 获取程序所需参数

所有程序所必须的参数均已在图片上标注

### 获取企业ID

![设置](/assets/wx_step_2.jpg)

### 获取应用信息

[点击打开企业微信应用管理](https://work.weixin.qq.com/wework_admin/frame#/apps)
-> 下滑找到“自建”

如果你是新创建的账号需要你创建应用，如果以之前已经创建应用可直接点击相应的应用，否则选择“创建应用”

![设置](/assets/wx_step_3.jpg)

上传引用Logo、填写应用名称、选择可见范围（可以选择第一级部门或者只选择你自己）

![设置](/assets/wx_step_4.jpg)

创建完引用会自动跳转到这个页面

![设置](/assets/wx_step_5.jpg)

> 注意：Secret 需要你下载手机企业微信客户端才可以查看

记录相关配置，后续配置环境变量时需要

点击“设置API接收”

### 生成服务器配置

![设置](/assets/wx_step_6.jpg)

配置完 `${应用TOKEN}` 和 `${应用AES_KEY}` 后基础信息已完成，可以开始部署了

### 完成配置

填写你的服务器URL 如：`https://wework-push.example.com/wx-callback`

点击 “保存” 即可

## 企业可信IP

调用推送API时企业微信会校验服务器IP，如果服务器IP没有在此配置列表中时无法发送消息

![配置服务器IP](/assets/wx_step_7.jpg)

对于没有明确IP的Serverless服务器（比如`Deno Deploy`）在每次发送失败时将该IP手动添加到列表里
