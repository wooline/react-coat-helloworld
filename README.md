- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用**，请先花点时间了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- react-coat 同时支持`客户端渲染`和`服务器渲染(SSR)`，本 Demo 仅演示`客户端渲染`,如果你需要`服务器渲染(SSR)`，可以在看完本 Demo 之后再查看： [SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)
- 本 Demo 不仅展示代码，也包括设计思路和推导过程
- 本 Demo 除了作为 react-coat 的演示，其**脚手架**也可以作为 SPA 单页应用的模版和范例
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

- **概要总览**
  - [安装](#安装)
  - [运行](#运行)
  - [查看在线 Demo](#查看在线-demo)
  - [关于脚手架](#关于脚手架)
    - [约定规则静态检查](#约定规则静态检查)
    - [PeerDependencies](#peerdependencies)
    - [Mock 服务器](#mock-服务器)
    - [CSS 及图片的模块化](#css-及图片的模块化)
    - [TS 类型的定义](#ts-类型的定义)
    - [环境变量定义](#环境变量定义)
    - [上线与发布](#上线与发布)
  - [主要目录结构](#主要目录结构)
  - [Redux Store 结构](#redux-store-结构)
- [业务需求](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/requirements.md)
- [路由设计](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/router.md)
- [模块与目录结构](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/modules.md)
- [重用与继承](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/reuse.md)
- [创建一个新 Module](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/setup.md)

## 安装

```
git clone 本项目
npm install
```

## 运行

- `npm start` 以开发模式运行
- `npm run build` 以产品模式编译生成文件
- `npm run prod-express-demo` 以产品模式编译生成文件并启用一个 express 做 demo
- `npm run gen-icon` 自动生成 [iconfont](https://iconfont.cn) 文件及 ts 类型

## 查看在线 Demo

> [点击查看在线 Demo](http://react-coat.spa.teying.vip/)

或者手机扫描二维码查看：

![在线 Demo](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/qr.png)

## 关于脚手架

- 采用 webpack 4.0 为核心搭建，无二次封装，干净透明
- 采用 typescript 作开发语言，使用 Postcss 及 less 构建 css
- 不使用 css module，用模块化命名空间保证 css 不冲突
- 采用 editorconfig > prettier 作统一的风格配置，建议使用 vscode 作为 IDE，并安装 prettier 插件以自动格式化
- 采用 tslint、eslint、stylelint 作代码检查
- 由于在 vscode 中触犯 prettier 规则并不能成为一个错误标记，所以使用 xxx-config-prettier 和 xxx-plugin-prettier，将 prettier 规则转化为 tslint、eslint、stylelint 规则

### 约定规则静态检查

react-coat 中很多是用约定代替了配置，但如果开发者粗心大意违返了约定，将导致程序出现错误，为了提前感知这些违返约定，本 demo 作了一些静态代码扫描 check 操作。目前仅支持少量规则，更多更严格 check 将在后续补充。
目前支持的有：

- @reducer 装饰器修饰的方法必须返回 State 类型
- @effect 装饰器修饰的方法必须是 async 函数
- 在 ModuleActionHandlers 中，所有 public 方法必须使用@reducer 或 @effect 装饰，否则请使用 protected 或 private

### PeerDependencies

开发环境需要很多的 dependencies，你可以自行安装特定版本，如果特殊要求，建议本站提供的 **react-coat-pkg** 以及 **react-coat-dev-pkg**，它们已经包含了绝大部分 dependencies。

### Mock 服务器

运行 Demo 需要从后台 api 中获取数据，通常得另外开一个 api 服务器，为此本 Demo 特意写了一个简单的 mock 中间件来合并到 webpackDevServer 中。

为什么不用 mock.js？

- 想生成贴合实际有意义的假数据，而不是一堆占位数据
- 想模似真实的 http 请求和返回

> 简单功能：

- 记录真实 api：如果启用`记录`功能，该中间件会拦截真实 api 的 Resphonse，将其以文件形式保存在/mock/temp/目录下
- mock 假数据：在/mock/下以文件形式创建一个 Resphonse、或者将/mock/temp/下的 api 历史记录 copy 到/mock/下，如果文件名与请求 URL 匹配，则直接拦截并返回该文件内容。
- 文件名与请求 URL 匹配规则：由于文件名不能存特殊字符，所以 url 中的特殊字符简单替换为-，为了支持正则，可以采用 base64 后的正则作为文件名

### CSS 及图片的模块化

本 Demo 并不采用 CSS Module 来进行 css 模块化，因为编译之后可读性不好，而且增加复杂度和编译时间。使用统一的 css 命名空间约定，我们也可以很简单的防止 css 命名冲突。

我们将 css 分为三大类：`全局(global)CSS、模块(Module)CSS、组件(Component)CSS`

- `全局(global)CSS`：跨模块、跨组件使用的公共 css，我们约定以"`g-`"开头，存放到/src/asset/css/global.css
- `模块(Module)CSS`：某模块私有使用的 css，我们约定以"`模块名-`"开头，跟随模块文件夹存放
  - `视图(View)CSS`：在模块 css 中，如果某些 css 仅为某个 view 私有使用，我们约定以"`模块名-视图名-`"开头，跟随视图文件夹存放
- `组件(Component)CSS`：某组件私有使用的 css，我们约定以"`comp-组件名-`"开头，跟随组件文件夹存放

类似的，对于项目中用到的图片，如果是跨模块、跨组件使用的，我们放到/src/asset/imgs/，而对于其它`模块私有、视图私有、组件私有`，我们跟随它们各自的文件夹存放

### TS 类型的定义

使用 Typescript 意味着使用强类型，我们把业务实体中 TS 类型定义分两大类：`API类型`和`Entity类型`。

- API 类型：指的是来自于后台 API 输入的类型，它们可能直接由 swagger 生成，或是机器生成。
- Entity 类型：指的是本系统为业务实体建模而定义的类型，每个业务实体(resource)都会有定义。

理想状况下，API 类型和 Entity 类型会保持一致，因为业务逻辑是同一套，但实际开发中，可能因为前后端并行开发、或者前后端视角不同而出现两者各表。

> 为了充分的解耦，我们允许这种不一致，我们把 API 类型在源头就转化为 Entity 类型，而在本系统的代码逻辑中，不直接使用 API 类型，应当使用自已定义的 Entity 类型，以减少其它系统对本系统的影响。

### 环境变量定义

- 静态环境变量，或叫元数据。通常会直接 hardcode 编译到代码中，放在/config/目录下，比如：

```
/config/dev/env.js 对应本地开发环境变量
/config/dev/prod.js 对应本地产品环境变量
/config/dev/demo.js 对应自定义环境变量
```

- 运行时环境变量，JS 运行时可能需要某些环境变量。放在/public/index.html 中：

```
<!-- {react-coat-init-env} -->
<script>
  function getInitEnv(env) {
    return $$ENV$$;
  }
</script>
```

> 为什么会放到 index.html 中？因为想把它当成一个可配置的 config，后期能让运维人员去自定义修改。如果放在 js 文件中会被打包并压缩，而如果独立出一个单独的配置文件又感觉没必要。

### 上线与发布

由于本 Demo 仅作为浏览器渲染，所有文件最终都是生成静态文件，所以上线发布很简单，只需要

```
npm run build
```

然后把/build/目录下的生成文件拷贝到服务器发布即可。

## 主要目录结构

```
├── build // 发布目录
├── config // 工程配置
├── scripts // npm 执行脚本
├── mock // mock后台api假数据
├── public // 无需编译的静态资源，发布时将直接copy到build目录
├── src
│    ├── asset // 存放公共静态资源
│    │       ├── css
│    │       ├── imgs
│    │       └── font
│    ├── entity // 存放业务实体TS类型定义
│    ├── common // 存放公共代码
│    ├── components // 存放React公共组件
│    ├── modules
│    │       ├── app // app模块
│    │       │     ├── views
│    │       │     │     ├── TopNav
│    │       │     │     ├── BottomNav
│    │       │     │     ├── ...
│    │       │     │     └── index.ts // 导出给其它模块使用的view
│    │       │     ├── model.ts // 定义ModuleState和ModuleActions
│    │       │     ├── api // 将本模块需要的后台api封装一下
│    │       │     ├── facade.ts // 导出本模块对外的逻辑接口（Actions、路由等）
│    │       │     └── index.ts // 导出本模块实体（view和model）
│    │       ├── photos // photos模块
│    │       │     ├── views
│    │       │     ├── model.ts
│    │       │     ├── api
│    │       │     ├── facade.ts
│    │       │     └── index.ts
│    │       ├── videos // videos模块
│    │       ├── messages // messages模块
│    │       ├── comments // comments模块
│    │       ├── names.ts // 定义模块名，使用枚举类型来保证不重复
│    │       └── index.ts // 导出模块的全局设置，如RootState类型、模块载入方式等
│    └──index.tsx 启动入口

```

## Redux Store 结构

```js
  router: { // 路由数据，redux reducer中间件生成
    location: {
      pathname: '/photos/item/1/comments/list',
      search: '?comments-search=%7B%22articleId%22...&photos-showComment=true',
      hash: '',
      key: 'dw8hbu'
    },
    action: 'PUSH',
    views: { // 根据pathname自动解析出当前展示哪些module的哪些view，详见"路由设计"
      app: {Main: true},
      photos: {Main: true, Details: true},
      comments: {Main: true, List: true}
    },
    pathData: { // 根据pathname自动解析出参数，详见"路由设计"
      app: {},
      photos: {itemId: '1'},
      comments: {type: 'photos', typeId: '1'}
    },
    searchData: { // 根据url search自动解析出参数，详见"路由设计"
      comments: {search: {articleId: '1', isNewest: true, page: 2}},
      photos: {showComment: true}
    },
    hashData: {}, // 根据url hash自动解析出参数，详见"路由设计"
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
  app: { // app ModuleState
    isModule: true, // Base ModuleState基类中的标识
    projectConfig: {
      logoUrl: '/imgs/logo.png',
      newMessage: 0,
      startupPage: {
        linkUrl: 'http://www.baidu.com/',
        imageUrl: '/imgs/startup.jpg',
        times: 5
      }
    },
    curUser: {
      uid: '0',
      username: 'guest',
      hasLogin: false,
      avatarUrl: '/imgs/avatar.png'
    },
    startupStep: 'startupAnimateEnd',
    loading: {
      global: 'Stop',
      login: 'Stop'
    },
    showSearch: false,
    showLoginPop: false,
    showRegisterPop: false
  },
  photos: {...}, // photos ModuleState
  comments: {...},  // comments ModuleState
}
```

---

接下来，让我们来了解一下本 Demo 的业务需求： [业务需求](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/requirements.md)
