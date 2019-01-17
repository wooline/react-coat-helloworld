import {Toast} from "antd-mobile";
import {CustomError} from "common/Errors";
import {ProjectConfig, StartupStep} from "entity/global";
import {CurUser} from "entity/session";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, ERROR, exportModel, LoadingState, reducer} from "react-coat";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";

// 定义本模块的State类型
export interface State extends BaseModuleState {
  showLoginPop?: boolean;
  showNotFoundPop?: boolean;
  showSearch?: boolean;
  projectConfig: ProjectConfig | null;
  curUser: CurUser | null;
  startupStep: StartupStep;
  loading: {
    global: LoadingState;
    login: LoadingState;
  };
}

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<State, RootState, ModuleNames> {
  constructor() {
    // 定义本模块State的初始值
    const initState: State = {
      projectConfig: null,
      curUser: null,
      startupStep: StartupStep.init,
      loading: {
        global: LoadingState.Stop,
        login: LoadingState.Stop,
      },
    };
    super(initState);
  }

  @reducer
  public putStartup(startupStep: StartupStep): State {
    return {...this.state, startupStep};
  }
  @reducer
  protected putCurUser(curUser: CurUser): State {
    return {...this.state, curUser};
  }
  @reducer
  public putShowLoginPop(showLoginPop: boolean): State {
    return {...this.state, showLoginPop};
  }
  @reducer
  public putShowNotFoundPop(showNotFoundPop: boolean): State {
    return {...this.state, showNotFoundPop};
  }
  @reducer
  public putShowSearch(showSearch: boolean): State {
    return {...this.state, showSearch};
  }
  @effect("login") // 使用自定义loading状态
  public async login(payload: {username: string; password: string}) {
    const loginResult = await sessionService.api.login(payload);
    if (!loginResult.error) {
      this.updateState({curUser: loginResult.data});
      Toast.success("欢迎您回来！");
    } else {
      alert(loginResult.error.message);
    }
  }

  // uncatched错误会触发@@framework/ERROR，兼听并发送给后台
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect(null) // 不需要loading，设置为null
  protected async [ERROR](error: CustomError) {
    if (error.code === "401") {
      this.dispatch(this.actions.putShowLoginPop(true));
    } else if (error.code === "404") {
      this.dispatch(this.actions.putShowNotFoundPop(true));
    } else if (error.code === "301" || error.code === "302") {
      this.dispatch(this.routerActions.replace(error.detail));
    } else {
      Toast.fail(error.message);
      await settingsService.api.reportError(error);
    }
  }
  // 兼听自已的INIT Action，做一些异步数据请求，不需要手动触发，所以请使用protected或private
  @effect()
  protected async [ModuleNames.app + "/INIT"]() {
    const [projectConfig, curUser] = await Promise.all([settingsService.api.getSettings(), sessionService.api.getCurUser()]);
    this.updateState({
      projectConfig,
      curUser,
      startupStep: StartupStep.configLoaded,
    });
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.app, ModuleHandlers);
