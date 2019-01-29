import {RootState as BaseState} from "react-coat";
import {ModuleNames} from "./names";

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

export type RootState = BaseState<ModuleGetter>;
