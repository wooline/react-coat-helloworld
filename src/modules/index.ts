import {RootState as BaseState} from "react-coat";
import {ModuleNames} from "./names";

// 定义模块的加载方案，同步或者异步均可
export const moduleGetter = (<T extends {[moduleName in ModuleNames]: () => any}>(getter: T) => {
  return getter as {[key in ModuleNames]: T[key]};
})({
  app: () => {
    return import(/* webpackChunkName: "app" */ "modules/app");
  },
  photos: () => {
    return import(/* webpackChunkName: "photos" */ "modules/photos");
  },
  videos: () => {
    return import(/* webpackChunkName: "videos" */ "modules/videos");
  },
  messages: () => {
    return import(/* webpackChunkName: "messages" */ "modules/messages");
  },
  comments: () => {
    return import(/* webpackChunkName: "comments" */ "modules/comments");
  },
});

export type ModuleGetter = typeof moduleGetter;

export type RootState = BaseState<ModuleGetter>;
