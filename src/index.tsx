import {moduleGetter} from "modules";
import {ModuleNames} from "modules/names";
import {buildApp} from "react-coat";

// 获取全局设置的函数，为了在上线后可以由运维修改，该函数的实现放在/public/index.html中，以防止被 webpack 打包
window.InitEnv = getInitEnv();

buildApp(moduleGetter, ModuleNames.app);
