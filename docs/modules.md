- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用**，请先花点时间了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- react-coat 同时支持`客户端渲染`和`服务器渲染(SSR)`，本 Demo 仅演示`客户端渲染`,如果你需要`服务器渲染(SSR)`，可以在看完本 Demo 之后再查看： [SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

- [概要总览](https://github.com/wooline/react-coat-spa-demo)
- [业务需求](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/requirements.md)
- [路由设计](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/router.md)
- **模块与目录结构**
  - [模块划分](#模块划分)
  - [comments 模块](#comments-模块)
  - [视图划分](#视图划分)
  - [目录结构](#目录结构)
  - [facade.ts](#facadets)
  - [配置模块加载](#配置模块加载)
  - [Redux Store 结构](#redux-store-结构)
- [重用与继承](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/reuse.md)
- [创建一个新 Module](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/setup.md)

## 模块划分

根据业务需求，我们大致能想到将系统划分成以下 5 个模块：

- **app** 总的 Application
- **photos** 旅游线路
- **videos** 分享视频
- **messages** 站内信
- **comments** 评论

## comments 模块

![详情页UI图](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/item-comments.jpg)

为什么会把 comments 也独立成为一个模块？

- react-coat 模块化强调`高内聚、低耦合`，尽管在 UI 视觉上`评论`和`详情`在一个 Page，但它们之间基本上没有交互操作
- 评论本身也是一种标准的列表，而且被 photos 和 videos 共用

那为什么不把评论当成一个 component 呢？

- 评论不仅是一个展示组件，更是反映特定的，较完整的业务
- module 允许封装自已的 model 来维护 action 和 state，而 component 只能简单的展现 state

## 视图划分

为每个模块进一步划分 View：

- app-views：Main、TopNav、BottomNav、LoginPop、Welcome、Loading
- photos-views：Main、List、Details
- videos-views：Main、List、Details
- messages-views：Main、List
- comments-views：Main、List、Details、Editor

并为需要对外路由的 View 配置 pathname:

```
export const moduleToUrl = {
  app: {Main: "/"},
  photos: {Main: "/photos", List: "/photos/list", Details: "/photos/item/:itemId"},
  videos: {Main: "/videos", List: "/videos/list", Details: "/videos/item/:itemId"},
  messages: {Main: "/messages", List: "/messages/list"},
  comments: {Main: "/:type/item/:typeId/comments", List: "/:type/item/:typeId/comments/list", Details: "/:type/item/:typeId/comments/item/:itemId"},
};
```

## 目录结构

由于 Demo 模块比较少，所以我们就不再用二级目录分类了，目录结构大致如下：

```
src
├── asset // 存放公共静态资源
│       ├── css
│       ├── imgs
│       └── font
├── entity // 存放业务实体TS类型定义
├── common // 存放公共代码
├── components // 存放React公共组件
├── modules
│       ├── app
│       │     ├── views
│       │     │     ├── TopNav
│       │     │     ├── BottomNav
│       │     │     ├── ...
│       │     │     └── index.ts //导出给其它模块使用的view
│       │     ├── model.ts //定义ModuleState和ModuleActions
│       │     ├── api //将本模块需要的后台api封装一下
│       │     ├── facade.ts //导出本模块对外的逻辑接口（类型、Actions、路由默认参数）
│       │     └── index.ts //导出本模块实体（view和model）
│       ├── photos
│       │     ├── views
│       │     ├── model.ts
│       │     ├── api
│       │     ├── facade.ts
│       │     └── index.ts
│       ├── videos
│       ├── messages
│       ├── comments
│       ├── names.ts //定义模块名，使用枚举类型来保证不重复
│       └── index.ts //导出模块的全局设置，如RootState类型、模块载入方式等
└──index.tsx 启动入口
```

## facade.ts

注意到每个 module 目录中，有一个 facade.ts 的文件，冒似它与 index.ts 一样都是导出本模块，那为什么不合并成一个呢？

- index.ts 导出的是整个模块的物理代码，因为模块是较为独立的，所以我们一般希望将整个模块的代码打包成一个独立的 chunk 文件。

- facade.ts 仅导出本模块的一些类型和逻辑接口，我们知道 TS 类型在编译之后是会被彻底抹去的，而接口仅仅是一个空的句柄。假如在 ModuleA 中需要 dispatch ModuleB 的 action，我们仅需要 import ModuleB 的 facade.ts，它只是一个空的句柄而以，并不会引起两个模块代码的物理依赖。

## 配置模块加载

`/src/modules/index.ts`此文件为模块的引入及配置文件，每增加一个模块，都需要在此文件中引入并配置一下，主要是一些类型和加载方式

```JS
// 此处是异步加载，也可改为同步
export const moduleGetter = {
  [ModuleNames.app]: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  [ModuleNames.photos]: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  [ModuleNames.videos]: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
  [ModuleNames.messages]: () => {
    return import(/* webpackChunkName: "messages" */ "modules/messages");
  },
  [ModuleNames.comments]: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
};
```

## Redux Store 结构

module 的划分不仅体现在工程目录上，而体现在 Redux Store、Url Store 中：

```js
  router: {
    ...
    views: { // 根据pathname自动解析出当前展示哪些module的哪些view
      app: {Main: true},
      photos: {Main: true, Details: true},
      comments: {Main: true, List: true}
    },
    pathData: { // 根据pathname自动解析出参数
      app: {},
      photos: {itemId: '1'},
      comments: {type: 'photos', typeId: '1'}
    },
    searchData: { // 根据url search自动解析出参数
      comments: {search: {articleId: '1', isNewest: true, page: 2}},
      photos: {showComment: true}
    },
    hashData: {}, // 根据url hash自动解析出参数
    wholeSearchData: { // url search merge 默认参数后的完整数据
      comments: {search: {articleId: '1', isNewest: true, page: 2, pageSize: 10}},
      photos: {search: {title: null, page: 1, pageSize: 10}, showComment: true},
      app: {showSearch: false, showLoginPop: false, showRegisterPop: false }
    },
    wholeHashData: { //url hash merge 默认参数后的完整数据
      app: {refresh: null},
      photos: {},
      comments: {}
    }
  },
  app: : {...}, // app ModuleState
  photos: {...}, // photos ModuleState
  comments: {...},  // comments ModuleState
}
```
