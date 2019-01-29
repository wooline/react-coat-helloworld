import {isForceRefresh, parseQuery} from "common/routers";
import {equal} from "common/utils";
import {ItemDetail, ListItem, ListSearch, ListSummary} from "entity/photo";
import {RootState} from "modules";
import commentsModule from "modules/comments/facade";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, exportModel, VIEW_INVALID} from "react-coat";
import api from "./api";
import {defaultListSearch} from "./facade";

// 定义本模块的State类型
export interface State extends BaseModuleState {
  listSearch?: ListSearch;
  listItems?: ListItem[];
  listSummary?: ListSummary;
  itemDetail?: ItemDetail;
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
  @effect()
  public async getItemDetail(itemDetailId: string) {
    const [itemDetail] = await Promise.all([api.getItemDetail(itemDetailId), api.hitItem(itemDetailId)]);
    this.updateState({itemDetail});
    await this.dispatch(commentsModule.actions.searchList({articleType: "photos", articleId: itemDetail.id}));
  }

  // 兼听路由变化的 action
  // 参数 null 表示不需要监控loading状态，searchList时会监控loading
  @effect(null)
  protected async [VIEW_INVALID]() {
    const views = this.rootState.views;
    if (views.photos && views.photos.List) {
      const {search, hash} = this.rootState.router.location;
      const forceRefresh = isForceRefresh(hash);
      const listSearch = parseQuery("search", search, defaultListSearch);
      if (forceRefresh || (forceRefresh === null && !equal(this.state.listSearch, listSearch))) {
        await this.dispatch(this.actions.searchList(listSearch));
      }
    } else if (views.photos && views.photos.Details) {
      const {pathname, hash} = this.rootState.router.location;
      const arr = pathname.match(/^\/photos\/(\d+)$/);
      if (arr) {
        const forceRefresh = isForceRefresh(hash);
        const itemId: string = arr[1];
        if (forceRefresh || (forceRefresh === null && (!this.state.itemDetail || this.state.itemDetail.id !== itemId))) {
          await this.dispatch(this.actions.getItemDetail(itemId));
        }
      }
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.photos, ModuleHandlers, initState);
