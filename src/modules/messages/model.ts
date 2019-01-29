import {isForceRefresh, parseQuery} from "common/routers";
import {equal} from "common/utils";
import {ListItem, ListSearch, ListSummary} from "entity/message";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, exportModel, VIEW_INVALID} from "react-coat";
import api from "./api";
import {defaultListSearch} from "./facade";

// 定义本模块的State类型
export interface State extends BaseModuleState {
  listSearch?: ListSearch;
  listItems?: ListItem[];
  listSummary?: ListSummary;
}

// 定义本模块State的初始值
const initState: State = {};

class ModuleHandlers extends BaseModuleHandlers<State, RootState, ModuleNames> {
  @effect()
  public async searchList(options: Partial<ListSearch> = {}) {
    const listSearch: ListSearch = {...(this.state.listSearch || defaultListSearch), ...options};
    const {listItems, listSummary} = await api.searchList(listSearch);
    this.updateState({listSearch, listItems, listSummary});
  }

  // 兼听路由变化的 action
  // 参数 null 表示不需要监控loading状态，searchList时会监控loading
  @effect(null)
  protected async [VIEW_INVALID]() {
    const views = this.rootState.views;
    if (views.messages && views.messages.List) {
      const {search, hash} = this.rootState.router.location;
      const forceRefresh = isForceRefresh(hash);
      const listSearch = parseQuery("search", search, defaultListSearch);
      if (forceRefresh || (forceRefresh === null && !equal(this.state.listSearch, listSearch))) {
        await this.dispatch(this.actions.searchList(listSearch));
      }
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.messages, ModuleHandlers, initState);
