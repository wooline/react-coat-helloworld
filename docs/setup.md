- 本 Demo 主要用来演示用 react-coat 来开发**SPA 单页应用**，请先花点时间了解一下：[react-coat v4.0](https://github.com/wooline/react-coat)
- react-coat 同时支持`客户端渲染`和`服务器渲染(SSR)`，本 Demo 仅演示`客户端渲染`,如果你需要`服务器渲染(SSR)`，可以在看完本 Demo 之后再查看： [SPA(单页应用)+SSR(服务器渲染)](https://github.com/wooline/react-coat-ssr-demo)
- [本 Demo 讨论提问专用贴](https://github.com/wooline/react-coat-spa-demo/issues/1)
- reac-coat 学习交流 QQ 群：**929696953**，有问题可以在群里问我

---

- [概要总览](https://github.com/wooline/react-coat-spa-demo)
- [业务需求](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/requirements.md)
- [路由设计](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/router.md)
- [模块与目录结构](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/modules.md)
- [重用与继承](https://github.com/wooline/react-coat-spa-demo/blob/master/docs/reuse.md)
- **创建一个新 Module**
  - [创建目录及文件](#创建目录及文件)
    - [1.创建 model.ts](#1创建-modelts)
    - [2.创建 facade.ts](#2创建-facadets)
    - [3.创建 views](#3创建-views)
    - [4.创建 index.ts](#4创建-indexts)
  - [配置引入](#配置引入)
    - [在 modules/names.ts 中命名模块](#在-modulesnamests-中命名模块)
    - [在 modules/index.ts 中引入模块](#在-modulesindexts-中引入模块)

前面说了很多设计思路，貌似比较复杂，其实做起来很简单，比如我们要创建一个新 Module，名为 newModule：

## 创建目录及文件

自行创建，或以某个 module 为母版复制如下目录结构：

```
├── modules
│       ├── newModule
│       │     ├── views
│       │     │     ├── ViewA.tsx
│       │     │     ├── ViewB.tsx
│       │     │     └── index.ts //导出给其它模块使用的view
│       │     ├── model.ts //定义ModuleState和ModuleActions
│       │     ├── facade.ts //导出本模块对外接口（类型、Actions、路由默认参数）
│       │     └── index.ts //导出本模块代码用来打包
│       ├── names.ts //定义模块名，使用枚举类型来保证不重复
│       └── index.ts //导出模块的全局设置，如RootState类型、模块载入方式等
```

### 1.创建 model.ts

newModule/model.ts:

```JS
// 定义本模块的State类型

export interface State extends BaseModuleState {
  showLoginPop?: boolean;
  ...
}

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<State, RootState, ModuleNames> {
   constructor() {
    // 定义本模块State的初始值
    const initState: State = {
      projectConfig: null,
      curUser: null,
      ...
    };
    super(initState);
  }
    ...
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

```

### 2.创建 facade.ts

facade.ts 用来导出本模块对外的接口和数据

newModules/facade.ts:

```JS
// 导出 ModuleState
export type ModuleState = State;

// 导出 actions
export default exportModule<ModuleActions>(ModuleNames.app);

// 导出路由规划
export const defRouteData: ModuleRoute<{}, {showSearch: boolean; showRegisterPop: boolean}, {refresh: boolean | null}> = {
  pathData: {},
  searchData: {showSearch: false, showRegisterPop: false},
  hashData: {
    refresh: null,
  },
};
```

### 3.创建 views

- 使用 React 创建 view。
- 在/views/index.ts 中导出

newModule/views/index.ts:

```JS
import {exportView} from "react-coat";
import model from "../model";
import MainComponent from "./Main";

// 导出一个名为 Main 的 View
export const Main = exportView(MainComponent, model);

```

### 4.创建 index.ts

模块根目录下的 index.ts 主要用来导出并打包代码

newModule/index.ts:

```JS
import model from "./model";
import * as views from "./views";
export {views, model};
```

## 配置引入

创建好一个新模块后，我们还需要稍作配置和引入。

### 在 modules/names.ts 中命名模块

```JS
export enum ModuleNames {
  app = "app",
  photos = "photos",
  videos = "videos",
  messages = "messages",
  newModule = "newModule",
}

```

### 在 modules/index.ts 中引入模块

```JS
// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = {
  ...
  [ModuleNames.newModule]: () => {
    return import(/* webpackChunkName: "newModule" */ "modules/newModule");
  },
};

// 定义整站的路由参数默认值
export const defRouteData = {
  ...
  [ModuleNames.newModule]: newModuleDefRouteData,
};

// 定义整站 RootState
interface States {
  ...
  [ModuleNames.newModule]: newModuleState;
}

// 定义路由与view的匹配模式
export const moduleToUrl = {
  ...
  newModule: {Main: "/videos", List: "/videos/list"},
};
```
