- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用**，请先花点时间了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- react-coat 同时支持`客户端渲染`和`服务器渲染(SSR)`，本 Demo 仅演示`客户端渲染`,如果你需要`服务器渲染(SSR)`，可以在看完本 Demo 之后再查看： [SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

- [概要总览](https://github.com/wooline/react-coat-spa-demo)
- [业务需求](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/requirements.md)
- **路由设计**
  - [路由规划](#路由规划)
  - [举例论证](#举例论证)
  - [序列化路由](#序列化路由)
  - [路由参数默认值](#路由参数默认值)
  - [URL Store](#url-store)
  - [URL Store 与 Redux Store](#url-store-与-redux-store)
  - [路由的不确定性](#路由的不确定性)
  - [RouterParser](#routerparser)
  - [@@router/LOCATION_CHANGE](#routerlocation_change)
- [模块与目录结构](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/modules.md)
- [重用与继承](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/reuse.md)
- [创建一个新 Module](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/setup.md)

一般来说，SPA 单页应用，是不需要规划什么路由的，就一个页面。但是需求中明确指出：

- android 手机上点击返回键能撤消操作：android 手机上点返回键会调用浏览器的后退事件，所以在新的操作时要 push 一个新的 URL。
- 需要能将当前页面分享给他人：需要用 URL 来标识和保存当前视图

> 这意味着，本项目虽然是 SPA 单页，但需要用 URL 路由来驱动视图的转变，不仅是 Page，还包括弹窗及其它小组件。所以视图交互流程为：鼠标及 UI 事件 -> URL 变化 -> 路由视图，或者直接： URL 变化 -> 路由视图。

## 路由规划

根据项目需求及 UI 图，我们初步规划主要路由如下：

- `旅行路线列表 photosList`：/photos/list
- `旅行路线详情 photosItem`：/photos/item/:photoId
- `分享小视频列表 videosList`：/videos/list
- `分享小视频详情 videosItem`：/videos/item/:videoId
- `站内信列表 messagesList`：/messages/list

注意到需求中，在详情页面，需要展示评论列表，并且评论列表比较独立，可以排序、翻页、以及查看某条评论的所有回复。

![详情页UI图](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/imgs/item-comments.jpg)

所以整个评论也就是一个标准的列表展示：

- `评论列表 commentsList`：/comments/list
- `评论详情 commentsItem`：/comments/item/:commentId

但是在 UI 设计图中，评论并不是单独作为一个 page 展示，而是和`旅行路线详情`、`分享小视频详情`一起展示，而且需求中说：评论及留言非常能吸引用户，所以分享页面时，要能将当前评论也一起分享。所以，我们必须将评论与详情路由合并：

- `旅行路线详情带评论列表 photosItem-commentsList`: /photos/item/:photoId/comments/list
- `旅行路线详情带评论详情 photosItem-commentsItem`: /photos/item/:photoId/comments/item/:commentId

## 举例论证

- 假设用户在浏览某视频(4568)的详情，并选择评论按“最新”排序，翻到了第 3 页。此时用户的 Url 应当为：

> /videos/item/4568/comments/list?comments-search-sort=dateTime&comments-search-page=3

- 假设用户在浏览某视频(4568)的详情，并点击了某条评论(5624)查看它的所有回复。此时用户的 Url 应当为：

> /videos/item/4568/comments/item/5624

- 旅游线路详情比视频详情更复杂一点，它支持评论的展示与隐藏，所以 URL 中还得多一个 photos-showComment 标识：

> /photos/item/4568/comments/list?comments-search-sort=dateTime&comments-search-page=3&photos-showComment=true

## 序列化路由

进一步来看：comments-search-sort=dateTime&comments-search-page=3，这种写法貌似太冗长，试想一下，如果评论列表还能带查询呢？comments-search-sort=dateTime&comments-search-page=3&comments-search-user=jimmy，这时候我们使用 **json** 表示似乎更简单，例如：

> comments-search={sort:"dateTime", page:3, user:"jimmy"}

## 路由参数默认值

假设当前查询条件为 comments-search={sort:"dateTime", page:1, user:null}，那如果把这个条件设为默认值，是不是可以省去不传了？每个查询条件都允许有一个默认值，如果当前条件和默认值相同，则可以省去，这样可以简化和缩短 URL：

```
/photos/list = /photos/list?photos-search={page:1,pageSize:20,sort:"dateTime",title:null}
/photos/list?photos-search={title:"自驾游"} = /photos/list?photos-search={page:1,pageSize:20,sort:"dateTime",title:"自驾游"}
```

看上去好很多，采用这种方案，我们需要做两项工作：

- 生成 Url 查询条件时，对比默认值，如果相同，则省去
- 收到 Url 查询条件时，将查询条件和默认值 merge

## URL Store

抽象一点来看，URL 是程序运行的一个快照或切片，URL 中包含的信息越多越细，程序的切片就能越多越细，URL 其实跟 redux 中的 store 一样，是程序的状态机，它记录了程序运行的某些状态，只不过 store 存在内存中，而 url 存在地址栏。

使用 URL Store，我们的页面颗粒细到不仅能定位到指定页面，还能定位到指定弹窗，甚至定位到某一步操作（实际需求可能并不需要这么细粒度，此处仅是为了演示）：

- photosList 旅行路线列表：[点击查看](http://react-coat.spa.teying.vip/photos/list)
- photosList 旅行路线列表搜索：[点击查看](http://react-coat.spa.teying.vip/photos/list?photos-search=%7B%22title%22%3A%22%u6D77%u5929%22%7D)
  - photosItem 旅行路线详情：[点击查看](http://react-coat.spa.teying.vip/photos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%7D)
  - photosItem-commentsList 详情带评论列表(最新、第 2 页)：[点击查看](http://react-coat.spa.teying.vip/photos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D&photos-showComment=true)
  - photosItem-commentsItem 详情带评论详情：[点击查看](http://react-coat.spa.teying.vip/photos/item/1/comments/item/16?photos-showComment=true)
- videosList 分享视频列表：[点击查看](http://react-coat.spa.teying.vip/videos/list)
- videosList 分享视频列表搜索：[点击查看](http://react-coat.spa.teying.vip/videos/list?videos-search=%7B%22title%22%3A%22%u6D77%u5929%22%7D)
  - videosItem 分享视频详情：[点击查看](http://react-coat.spa.teying.vip/videos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%7D)
  - videosItem-commentsList 详情带评论列表(最新、第 2 页)：[点击查看](http://react-coat.spa.teying.vip/videos/item/1/comments/list?comments-search=%7B%22articleId%22%3A%221%22%2C%22isNewest%22%3Atrue%2C%22page%22%3A2%7D)
  - videosItem-commentsItem 详情带评论详情：[点击查看](http://react-coat.spa.teying.vip/videos/item/1/comments/item/16)
- messagesList 分享小视频列表：[点击查看](http://react-coat.spa.teying.vip/messages/list)

## URL Store 与 Redux Store

- URL Store 仅是一个局部的 Store，只包含当前需要展示的部分，而 Redux Store 包含全部的完整的部分
- URL Store 仅适应于有 URL 概念的 runtime 中，而 Redux Store 则适应于所有 runtime
- URL Store 是明文暴露给用户看的，而 Redux Store 仅开发者感知

> 所以，我们仅把 URL Store 当作是 Redux Store 的冗余和变化因子，它最终会被消化并转变成为 Redux store 的一部分。程序开发过程中不应当直接依赖于 URL Store，而应当依赖 Redux store。当 URL 发生变化的时候，我们应当第一时间，将这种变化消化并转换为 Redux Store

**路由的模块化：**

react-coat 强调业务模块化，每个模块应当自已设计自已的 URL 参数，它们是分散在模块中的。在本 Demo 中，评论模块有自已的查询条件和路由参数，旅游线路模块也有自已的查询条件和路由参数，当他们被 UI 设计合并到一个 page 时，会不会出现路由参数名冲突呢？完全可能，模块是独立的，每个模块可以独立的定义自已的路由参数，而 URL 是被所有展示模块共享的，为避免多模块一起展示时路由参数命名冲突，在序列化 URL 的时候，我们给模块定义的路由参数加上一个**模块名作为前缀**，例如：

> comments-search={sort:"dateTime", page:3, user:"jimmy"}&photos-search={sort:"dateTime", page:3, user:"jimmy"}&photos-showComment=true

最终，我们的 URL Store 也有与 Redux Store 类似的结构，每个模块对应一个子节点，并以模块名作为 key，例如：

```js
  router: { // 路由数据，redux reducer中间件生成
    location: {
      pathname: '/photos/item/1/comments/list',
      search: '?comments-search=%7B%22articleId%22...&photos-showComment=true',
      hash: '',
      key: 'dw8hbu'
    },
    action: 'PUSH',
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
  app: {...}, // app ModuleState
  photos: {...}, // photos ModuleState
  comments: {...}, // comments ModuleState
}
```

可以看到，以上的：views、pathData、searchData、hashData、wholeSearchData、wholeHashData 都是采用`模块名`作为子 key

## 路由的不确定性

这里说的不确定性是指`路由需求多变`，不同于变量命名，路由（由其是 pathname）是明文暴露给用户的，所以可能需要反复斟酌与调整。所以我们最好不要将 pathname 直接写死在代码中，比如：

```
const url = "/photos/list" + search;
```

```
if(pathname === "/photos/list"){
    ....
}
```

假设到后期要上线了，突然产品说，我们要把所有路由的/photos/改为/tour/picture/，我们当然不希望人肉整站搜索来改动，如果能有个配置文件就好了。其实，不管最终如何命名，始终不变的是 view 视图本身。

- 我们可以把 pathname 来记录当前需要展示哪些 view，而 search 用来记录当前 view 的不同状态

- pathname 和我们的 view 是相互对应的，知道了 pathname 就能知道当前展示哪些 view，反过来，知道当前要展示哪个 view 就能知道 pathname 是什么

```
// pathname配置，将每个Module中的view与一个pathname表达式对应：

export const moduleToUrl: {[K in keyof ModuleGetter]: {[V in keyof ReturnModule<ModuleGetter[K]>["views"]]+?: string}} = {
  app: {Main: "/", LoginForm: "/login"},
  photos: {Main: "/photos", List: "/photos/list", Details: "/photos/item/:itemId"},
  videos: {Main: "/videos", List: "/videos/list", Details: "/videos/item/:itemId"},
  messages: {Main: "/messages", List: "/messages/list"},
  comments: {Main: "/:type/item/:typeId/comments", List: "/:type/item/:typeId/comments/list"},
};

if(isCurrentView("photos","List")){
    ...
}
```

## RouterParser

react-coat 集成了 connected-react-router 自动将 URL 解析成 Redux Store，但它仅仅是作简单的解析，而我们需要的是复杂的 URL Store，所以我们使用框架提供的一个自定义路由解析 hook：

> export declare type RouterParser<T = any> = (nextRouter: T, prevRouter?: T) => T;

我们利用这个钩子来进行路由的反序列化，将 moduleName 前缀转换为数据结构，并自动 merge 默认参数：

```JS
// /src/common/routers.ts
export const routerParser: RouterParser<RootRouter> = (nextRouter, prevRouter) => {
  const nRouter: RootRouter = {...nextRouter};
  const changed = {pathname: false, search: false, hash: false};
  if (!prevRouter || nextRouter.location.pathname !== prevRouter.location.pathname) {
    const {views, pathData} = parsePathname(nextRouter.location.pathname);
    nRouter.views = views;
    nRouter.pathData = pathData;
    changed.pathname = true;
  }
  if (!prevRouter || nextRouter.location.search !== prevRouter.location.search) {
    nRouter.searchData = nextRouter.location.search.split(/[&?]/).reduce(parseRoute, {});
    changed.search = true;
  }
  if (!prevRouter || nextRouter.location.hash !== prevRouter.location.hash) {
    nRouter.hashData = nextRouter.location.hash.split(/[&#]/).reduce(parseRoute, {});
    changed.hash = true;
  }
  if (changed.pathname || changed.search) {
    nRouter.wholeSearchData = mergeDefData(nRouter.views, nRouter.searchData, defSearch);
  }
  if (changed.pathname || changed.hash) {
    nRouter.wholeHashData = mergeDefData(nRouter.views, nRouter.hashData, defHash);
  }
  return nRouter;
};
```

## @@router/LOCATION_CHANGE

react-coat 在 url 发生改变时会触发此 action，我们在 model 中兼听它，并在第一时间解析它，并转化为 Redux Store：

```JS
  @effect(null)
  protected async ["@@router/LOCATION_CHANGE"](router: RouterState) {
    const {views} = this.rootState.router;
    if (isCur(views, this.namespace)) { //只有在本模块被当前展示的情况下才进行解析
      this.dispatch(this.callThisAction(this.parseRouter));
    }
  }
```
