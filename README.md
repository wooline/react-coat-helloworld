- react-coat 同时支持`浏览器渲染(SPA)`和`服务器渲染(SSR)`，本 Demo 仅演示`浏览器渲染`，请先了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)

- react-coat4.0 推出之后，不少网友反映附带的 2 个 Demo 写得太复杂。主要问题是：

> 其一，路由封装太重。

其实，框架本身并没有过度封装路由，只集成了`connected-react-router`，然后留了一个钩子：

```JS
declare type RouterParser<T = any> = (nextRouter: T, prevRouter?: T) => T;
```

可以看到 T 类型为 any，也就是留给用户自已定义，因为路由方案有很多种，并没有什么最佳实践，所以框架将这部分自由留给用户。

> 其二，model 的继承太抽象。

继承还是混合？对象式还是函数式？其实一直都是争议的话题，都有各自的优缺点，也没有什统一标准。所以框架本身也没有做这方面的限制，你可以选择继承，也可以选择混合，选择权在用户自已。

- 为了循序渐进，在此重新将 Demo 拆分为三个：

> [入手：Helloworld（本 demo）](https://github.com/wooline/react-coat-helloworld)

> [进阶：SPA(单页应用)](https://github.com/wooline/react-coat-spa-demo)

> [升级：SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)

---

# 本 Demo 为第一步：Helloworld

### 安装

```
git clone https://github.com/wooline/react-coat-helloworld.git
npm install
```

### 运行

- `npm start` 以开发模式运行
- `npm run build` 以产品模式编译生成文件
- `npm run prod-express-demo` 以产品模式编译生成文件并启用一个 express 做 demo
- `npm run gen-icon` 自动生成 [iconfont](https://iconfont.cn) 文件及 ts 类型

### 查看在线 Demo

- [点击查看在线 Demo](http://react-coat.spa.teying.vip/)

- 或者手机扫码查看：
  ![在线 Demo](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/qr.png)

### 关于脚手架

- 采用 webpack 4.0 为核心搭建，无二次封装，干净透明
- 采用 typescript 作开发语言，使用 Postcss 及 less 构建 css
- 不使用 css module，用模块化命名空间保证 css 不冲突
- 采用 editorconfig > prettier 作统一的风格配置，建议使用 vscode 作为 IDE，并安装 prettier 插件以自动格式化
- 采用 tslint、eslint、stylelint 作代码检查

#### 约定规则静态检查

react-coat 中很多是用约定代替了配置，但如果开发者粗心大意违返了约定，将导致程序出现错误，为了提前感知这些违返约定，本 demo 作了一些静态代码扫描 check 操作。目前仅支持少量规则，更多更严格 check 将在后续补充。
目前支持的有：

- @reducer 装饰器修饰的方法必须返回 State 类型
- @effect 装饰器修饰的方法必须是 async 函数
- 在 ModuleActionHandlers 中，所有 public 方法必须使用@reducer 或 @effect 装饰，否则请使用 protected 或 private

#### PeerDependencies

开发环境需要很多的 dependencies，你可以自行安装特定版本，如果特殊要求，建议本站提供的 **react-coat-pkg** 以及 **react-coat-dev-pkg**，它们已经包含了绝大部分 dependencies。

#### Mock 服务器

运行 Demo 需要从后台 api 中获取数据，通常得另外开一个 api 服务器，为此本 Demo 特意写了一个简单的 mock 中间件来合并到 webpackDevServer 中。

为什么不用 mock.js？

- 想生成贴合实际有意义的假数据，而不是一堆占位数据
- 想模似真实的 http 请求和返回

> 简单功能：

- 记录真实 api：如果启用`记录`功能，该中间件会拦截真实 api 的 Resphonse，将其以文件形式保存在/mock/temp/目录下
- mock 假数据：在/mock/下以文件形式创建一个 Resphonse、或者将/mock/temp/下的 api 历史记录 copy 到/mock/下，如果文件名与请求 URL 匹配，则直接拦截并返回该文件内容。
- 文件名与请求 URL 匹配规则：由于文件名不能存特殊字符，所以 url 中的特殊字符简单替换为-，为了支持正则，可以采用 base64 后的正则作为文件名

#### CSS 及图片的模块化

本 Demo 并不采用 CSS Module 来进行 css 模块化，因为编译之后可读性不好，而且增加复杂度和编译时间。使用统一的 css 命名空间约定，我们也可以很简单的防止 css 命名冲突。

我们将 css 分为三大类：`全局(global)CSS、模块(Module)CSS、组件(Component)CSS`

- `全局(global)CSS`：跨模块、跨组件使用的公共 css，我们约定以"`g-`"开头，存放到/src/asset/css/global.css
- `模块(Module)CSS`：某模块私有使用的 css，我们约定以"`模块名-`"开头，跟随模块文件夹存放
  - `视图(View)CSS`：在模块 css 中，如果某些 css 仅为某个 view 私有使用，我们约定以"`模块名-视图名-`"开头，跟随视图文件夹存放
- `组件(Component)CSS`：某组件私有使用的 css，我们约定以"`comp-组件名-`"开头，跟随组件文件夹存放

类似的，对于项目中用到的图片，如果是跨模块、跨组件使用的，我们放到/src/asset/imgs/，而对于其它`模块私有、视图私有、组件私有`，我们跟随它们各自的文件夹存放

#### TS 类型的定义

使用 Typescript 意味着使用强类型，我们把业务实体中 TS 类型定义分两大类：`API类型`和`Entity类型`。

- API 类型：指的是来自于后台 API 输入的类型，它们可能直接由 swagger 生成，或是机器生成。
- Entity 类型：指的是本系统为业务实体建模而定义的类型，每个业务实体(resource)都会有定义。

理想状况下，API 类型和 Entity 类型会保持一致，因为业务逻辑是同一套，但实际开发中，可能因为前后端并行开发、或者前后端视角不同而出现两者各表。

> 为了充分的解耦，我们允许这种不一致，我们把 API 类型在源头就转化为 Entity 类型，而在本系统的代码逻辑中，不直接使用 API 类型，应当使用自已定义的 Entity 类型，以减少其它系统对本系统的影响。

---

- [假定项目：旅途 web app](#假定项目旅途-web-app)
  - [主要页面：](#主要页面)
  - [项目要求](#项目要求)
  - [路由规划](#路由规划)
    - [path 规划](#path-规划)
    - [参数规划](#参数规划)
    - [路由参数默认值](#路由参数默认值)
    - [不直接使用路由状态](#不直接使用路由状态)
  - [模块规划](#模块规划)
    - [模块与 Page 无关](#模块与-page-无关)
    - [为模块划分 View](#为模块划分-view)
  - [目录结构](#目录结构)
    - [facade.ts](#facadets)
    - [配置模块](#配置模块)
  - [路由和加载](#路由和加载)
  - [Redux Store 结构](#redux-store-结构)
  - [具体实现](#具体实现)
- [美中不足](#美中不足)
  - [路由规划的不足](#路由规划的不足)
  - [路由效验的不足](#路由效验的不足)
  - [Model 中重复写同样的代码](#model-中重复写同样的代码)
- [下一个 Demo](#下一个-demo)

## 假定项目：旅途 web app

### 主要页面：

- 旅游路线展示
- 旅途小视频展示
- 站内信展示（需登录）
- 评论展示 （访客可查看评论，发表则需登录）

![旅途项目UI图](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/requirements.jpg)

### 项目要求

- web SPA 单页应用
- 主要用于 mobile 浏览器，也可以适应于桌面浏览器
- 无 SEO 要求，但需要能将当前页面分享给他人
- 初次进入本站时，显示 welcome 广告，并倒计时

### 路由规划

SPA 单页不就一个页面么？为什么还需要规划路由呢？

- 其一，为了用户刷新时尽可能的保持当前展示
- 其二，为了用户能将当前展示通过 url 分享给他人
- 其三，为了后续的 SEO

#### path 规划

根据项目需求及 UI 图，我们初步规划主要路由 path 如下：

- `旅行路线列表 photosList`：/photos
- `旅行路线详情 photosItem`：/photos/:photoId
- `分享小视频列表 videosList`：/videos
- `分享小视频详情 videosItem`：/videos/:videoId
- `站内信列表 messagesList`：/messages

#### 参数规划

因为列表页是有分页、有搜索的，所以列表类型的路由是有参数的，比如：

> /photos?title=张家界&page=3&pageSize=20

我们估且将这部分查询列表条件叫"ListSearch"，但除了`ListSearch`之外，也可能会出现别的路由参数，用来控制其它条件（本 demo 暂未涉及），比如：

> /photos?title=张家界&page=3&pageSize=20&showComment=true

所以，如果参数一多，用扁平的一维结构就变得不好表达。而且，利用 URL 参数存数据，数据将全变成为字符串。比如`id=2`,你无法知道 2 是数字型还是字符型，这样会让后续接收处理变得繁重。所以，我们使用 JSON 来序列化第二级参数，比如：

> /photos?search={title:"张家界",page:3,pageSize:20}&showComment=true

这样做也有个不好的地方，就是需要 encodeURI，然后特殊字符会变得比较丑。

#### 路由参数默认值

为了缩短 URL 长度，本框架设计了参数默认值，如果某参数和默认值相同，可以省去。我们需要做两项工作：

- 生成 Url 查询条件时，对比默认值，如果相同，则省去

> 原值：{title:"张家界",page:1,pageSize:20} 默认值： {title:"",page:1,pageSize:20}，省去后为：{title:"张家界"}

> 原值：{title:"",page:1,pageSize:20} 默认值： {title:"",page:1,pageSize:20}，省去后为：空

- 收到 Url 查询条件时，将查询条件和默认值 merge

> /photos?search={page:2} === photos?search={title:"",page:2,pageSize:20}

> /photos === photos?search={title:"",page:1,pageSize:20}

- 处理 null、undefined

由于接收 Url 参数时，如果某 key 为 undefined，我们会用相应的默值将其填充，所以不能将 undefined 作为路由参数值定义，改为使用 null。也就是说，路由参数中的每一项，都是必填的，比如：

```JS
// 路由参数定义时，每一项都必填，以下为错误示例
interface ListSearch{
  title?:string,
  age?:number
}
// 改为如下正确定义：
interface ListSearch{
  title:string | null,
  age:number | null
}
```

- 区分：原始路由参数(SearchData) 默认路由参数(SearchData) 和 完整路由参数(WholeSearchData)。完整路由参数(WholeSearchData) = merage(默认路由参数(SearchData), 原始路由参数(SearchData))
  - 原始路由参数(SearchData)每一项都是可选的，用 TS 类型表示为：`Partial<WholeSearchData>`
  - 完整路由参数(WholeSearchData)每一项都是必填的，用 TS 类型表示为：`Required<SearchData>`
  - 默认路由参数(SearchData)和完整路由参数(WholeSearchData)类型一致

#### 不直接使用路由状态

路由及其参数本质上也是一种 Store，与 Redux Store 一样，反映当前程序的某些状态。但它是片面的，是瞬时的，是不稳定的，我们把它看作是 Redux Store 的一种冗余。所以最好不要在程序中直接依赖和使用它，而是控制住它的入口和出口，第一时间在其源头进行消化转换，让其成为整个 Redux Store 的一部分，后续的运行中，我们直接依赖 Redux Store。这样，我们就将程序与路由设计解耦了，程序有更大的灵活度甚至可以迁移到无 URL 概念的其它运行环境中。

### 模块规划

#### 模块与 Page 无关

划分模块可以很好的拆解功能，化繁为简，并且对内隐藏细节，对外暴露少量接口。划分模块的标准是`高内聚，低耦合`，而不是以 Page 或是 View，一个模块包含某些完整的业务功能，这些功能可能涉及到多个 Page 或多个 View。

所以回过头，看我们的项目需求和 UI 图，大体上可以分为三个模块：

- photos //旅游线路展示
- videos //分享视频展示
- messages //站内消息展示

这三个模块显而易见，但是我们注意到：“图片详情”和“视频详情”都包含“评论展示”，而“评论展示”本身又具有分页、排序、详情展示、创建回复等功能，它具有自已独立的逻辑，只不过在 view 上被 photoDetail 和 videoDetail 嵌套了，所以将“评论展示”独立划分成一个模块是合适的。

另个，整个程序应当有个启动模块，它是“上帝视角模块”，它可以做一些公共事业，必要的时候也可以用来做多个模块之间的协调和调度，我们叫把它叫做 applicatioin 模块。

所以最终，本 Demo 被划分为 5 个模块：

- app // 启动模块
- photos //旅游线路展示
- videos //分享视频展示
- messages //站内消息展示
- comments //评论展示

#### 为模块划分 View

每个模块可能包含一组 View，View 反映某些特定的业务逻辑。View 就是 React 中的 Component，那反过来 Component 就是 View 么？非也，它们之间还是有些区别的：

- view 展现的是 Store 数据，更偏重于表现特定的具体的业务逻辑，所以它的 props 一般是直接用 mapStateToProps connect 到 store。
- component 体现的是一个没有业务逻辑上下文的纯组件，它的 props 一般来源于父级传递。
- component 通常是公共的，而 view 通常非公用

回过头，看我们的项目需求和 UI 图，大体上划分以下 view：

- app views：Main、TopNav、BottomNav、LoginPop、Welcome、Loading
- photos views：Main、List、Details
- videos views：Main、List、Details
- messages views：Main、List
- comments views：Main、List、Details、Editor

### 目录结构

经过上面的分析，我们有了项目大至的骨架，由于模块比较少，所以我们就不再用二级目录分类了：

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

#### facade.ts

其它目录都好理解，注意到每个 module 目录中，有一个 facade.ts 的文件，冒似它与 index.ts 一样都是导出本模块，那为什么不合并成一个呢？

- index.ts 导出的是整个模块的物理代码，因为模块是较为独立的，所以我们一般希望将整个模块的代码打包成一个独立的 chunk 文件。
- facade.ts 仅导出本模块的一些类型和逻辑接口，我们知道 TS 类型在编译之后是会被彻底抹去的，而接口仅仅是一个空的句柄。假如在 ModuleA 中需要 dispatch ModuleB 的 action，我们仅需要 import ModuleB 的 facade.ts，它只是一个空的句柄而以，并不会引起两个模块代码的物理依赖。

#### 配置模块

> 问：在 react-coat 中怎么配置一个模块？包括打包、加载、注册、管理其生命周期等？

答：./src/modules 根目录下的 index.ts 文件为模块总的配置文件，增加一个模块，只需要在此配置一下

```JS
// ./src/modules/index.ts

// 一个验证器，利用TS类型来确保增加一个module时，相关的配置都同时增加了
type ModulesDefined<T extends {[key in ModuleNames]: any}> = T;

// 定义模块的加载方案，同步或者异步均可
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

export type ModuleGetter = ModulesDefined<typeof moduleGetter>; // 验证一下是否有模块忘了配置

// 定义整站Module States
interface States {
  [ModuleNames.app]: AppState;
  [ModuleNames.photos]: PhotosState;
  [ModuleNames.videos]: VideosState;
  [ModuleNames.messages]: MessagesState;
  [ModuleNames.comments]: CommentsState;
}

// 定义整站的Root State
export type RootState = BaseState & ModulesDefined<States>; // 验证一下是否有模块忘了配置
```

### 路由和加载

本 Demo 直接使用 `react-router V4`，路由即组件，所以并不需要什么特别的路由配置，直接在./app/views/Main.tsx 中：

```JS

const PhotosView = loadView(moduleGetter, ModuleNames.photos, "Main");
const VideosView = loadView(moduleGetter, ModuleNames.videos, "Main");
const MessagesView = loadView(moduleGetter, ModuleNames.messages, "Main");

<Switch>
  <Redirect exact={true} path="/" to="/photos" />
  <Route exact={false} path="/photos" component={PhotosView} />
  <Route exact={false} path="/videos" component={VideosView} />
  <Route exact={false} path="/messages" component={MessagesView} />
  <Route component={NotFound} />
</Switch>
```

使用 loadView()表示异步按需加载一个 View，如果你不想按需加载，完全可以直接 import：

```JS
import {Main as PhotosView} from "modules/photos/views"
```

载入 View 时自动载入其相关的模块并初始化 Model。没有 Model，view 是没有“灵魂”的，所以在载入 View 时，框架会自动载入其 Model 并完成初始化，这个过程包含 3 步：

- 1.载入模块对应的 JS Chunk 包
- 2.初始化模块 Model，派发 module/INIT Action
- 3.模块可以监听自已的 module/INIT Action，作出初始化行为，如获取远程数据等

### Redux Store 结构

module 的划分不仅体现在工程目录上，而体现在 Redux Store 中：

```js
  router: { // 由 connected-react-router 生成
    location: {
      pathname: '/photos',
      search: '',
      hash: '#refresh=true',
      key: 'gb9ick'
    },
    action: 'PUSH'
  },
  app: {...}, // app ModuleState
  photos: { // photos ModuleState
    isModule: true, // 框架自动生成，标明该节点为一个ModuleState
    listSearch: { // 列表搜索条件
      title: '',
      page: 1,
      pageSize: 10
    },
    listItems: [ // 列表数据
      {
        id: '1',
        title: '新加坡+吉隆坡+马六甲6或7日跟团游',
        departure: '无锡',
        type: '跟团游',
        price: 2499,
        hot: 265,
        coverUrl: '/imgs/1.jpg'
      },
      ...
    ],
    listSummary: {
      page: 1,
      pageSize: 5,
      totalItems: 10,
      totalPages: 2
    }
  },
  messages: {...}, // messages ModuleState
  comments: {...},  // comments ModuleState
}
```

### 具体实现

见 Demo 源码，有注释

## 美中不足

### 路由规划的不足

到目前为止，本 Demo 完成了项目要求中的内容，接下来，业务看了之后提出了几个问题：

- 无法分享指定的“评论”，评论是很重要的吸引眼球的内容，我们希望分享链接时，可以指定评论。

目前可以分享的路由只有 5 种：

```
- /photos
- /photos/1
- /videos
- /videos/1
- /messages
```

看样子，我们得增加：

```
/photos/1/comments/3  //展示id为3的评论
```

- 评论内容对以后的 SEO 很重要，我们希望路由能控制评论列表翻页和排序：

```
/photos/1?comments-search={page:2,sort:"createDate"}
```

- 目前我们的项目主要用于移动浏览器访问，很多 android 用户习惯用手机下面的返回键，来撤消操作，如关闭弹窗等，能否模拟一下原生 APP？

思考：android 用户点击手机下面的返回键会引起浏览器的后退，后退关闭弹窗，那就需要在弹出弹窗时增加一条 URL 记录
结论：Url 路由不只用来记录展示哪个 Page、哪个 View，还得标识一些交互操作，完全颠覆了传统的路由观念了。

### 路由效验的不足

> 看样子，路由会越来越复杂，到目前为止，我们还没有在 TS 中很好的管理路由参数，拼接 URL 时没有做 TS 类型的校验。对于 pathname 我们都是直接用字符串写死在程序中，比如：

```JS
if(pathname === "/photos"){
  ....
}

const arr = pathname.match(/^\/photos\/(\d+)$/);
```

这样直接 hardcode 似利不是很好，如果后其产品想换一下名称怎么搞。

### Model 中重复写同样的代码

注意到，photos/model.ts、videos/model.ts 中，90%的代码是一样的，为什么？因为它们两个模块基本上功能都是差不多的：列表展示、搜索、获取详情...

其实不只是 photos 和 videos，套用 RestFul 的理念，我们用网页交互的过程就是在对“资源 Resource”进行维护，无外乎“增删改查”这些基本操作，大部分情况下，它们的逻辑是相似的。由其是在后台系统中，基本上连 UI 界面也可以标准化，如果将这部分“增删改查”的逻辑提取出来，模块可以省去不少重复的代码。

### 下一个 Demo

既然有这么多美中不足，那我们就期待在下一个 Demo 中一步步解决它吧

> [进阶：SPA(单页应用)](https://github.com/wooline/react-coat-spa-demo)
