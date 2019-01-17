- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用**，请先花点时间了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- react-coat 同时支持`客户端渲染`和`服务器渲染(SSR)`，本 Demo 仅演示`客户端渲染`,如果你需要`服务器渲染(SSR)`，可以在看完本 Demo 之后再查看： [SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

- [概要总览](https://github.com/wooline/react-coat-spa-demo)
- **业务需求**
  - [项目名称](#项目名称)
  - [项目简介](#项目简介)
  - [主要页面](#主要页面)
  - [项目要求](#项目要求)
  - [UI 图](#ui-图)
  - [效果展示](#效果展示)
- [路由设计](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/router.md)
- [模块与目录结构](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/modules.md)
- [重用与继承](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/reuse.md)
- [创建一个新 Module](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/setup.md)

> 本 demo 虚拟了一个假设的项目：**旅途 web app**，做几个简单的页面，作为框架的 Demo，请不用太考究需求的真实性与合理性。

### 项目名称

旅途 web app

### 项目简介

展示旅游线路，分享旅途小视频、留言评论等

### 主要页面

- 旅游路线展示
- 旅途小视频展示
- 站内信展示（需登录）
- 评论展示 （访客可查看评论，发表则需登录）

### 项目要求

- web SPA 单页应用，仿原生 APP（android 手机上点返回键能撤销操作）
- 主要用于 mobile 浏览器，也可以适应于桌面浏览器
- 无 SEO 要求，但需要能将当前页面分享给他人
- 评论及留言非常能吸引用户，所以分享页面时，要能将当前评论也一起分享
- 初次进入本站时，显示 welcome 广告，并倒计时

### UI 图

![旅途项目UI图](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/requirements.jpg)

### 效果展示

- 旅行路线列表 photosList [点击查看](http://react-coat.spa.teying.vip/photos/list)
- 旅行路线列表带搜索 photosList-search [点击查看](http://react-coat.spa.teying.vip/photos/list?photos-search=%7B%22title%22%3A%22%u6D77%u5929%22%7D)
- 旅行路线详情 photosItem [点击查看](http://react-coat.spa.teying.vip/photos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%7D)
- 旅行路线详情带评论列表 photosItem-commentsList [点击查看](http://react-coat.spa.teying.vip/photos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D&photos-showComment=true)
- 旅行路线详情带评论详情 photosItem-commentsItem [点击查看](http://react-coat.spa.teying.vip/photos/item/1/comments/item/16?photos-showComment=true)
- 分享视频列表 videosList [点击查看](http://react-coat.spa.teying.vip/videos/list)
- 分享视频列表带搜索 videosList-search [点击查看](http://react-coat.spa.teying.vip/videos/list?videos-search=%7B%22title%22%3A%22%u6D77%u5929%22%7D)
- 分享视频详情带评论列表 videosItem-commentsList [点击查看](http://react-coat.spa.teying.vip/videos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D)
- 分享视频详情带评论详情 videosItem-commentsItem [点击查看](http://react-coat.spa.teying.vip/videos/item/1/comments/item/16)
- 站内信列表 messagesList [点击查看](http://react-coat.spa.teying.vip/messages/list)
