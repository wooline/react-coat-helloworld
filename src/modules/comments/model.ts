import {Toast} from "antd-mobile";
import {ItemCreateData, ItemDetail, ListItem, ListSearch, ListSummary} from "entity/comment";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import {Actions, BaseModuleHandlers, BaseModuleState, effect, exportModel, reducer} from "react-coat";
import api from "./api";
import {defaultListSearch} from "./facade";

// 定义本模块的State类型
export interface State extends BaseModuleState {
  listSearch: ListSearch;
  listItems?: ListItem[];
  listSummary?: ListSummary;
  itemDetail?: ItemDetail;
}

class ModuleHandlers extends BaseModuleHandlers<State, RootState, ModuleNames> {
  constructor() {
    // 定义本模块State的初始值
    const initState: State = {
      listSearch: defaultListSearch,
    };
    super(initState);
  }

  @reducer
  public putItemDetail(itemDetail?: ItemDetail): State {
    return {...this.state, itemDetail};
  }

  @effect()
  public async createItem(data: ItemCreateData) {
    const response = await api.createItem(data);
    if (!response.error) {
      Toast.info("操作成功");
      // 如果创建成功，要让用户看到自已发表的评论，必须刷新列表，以创建时间排序
      if (this.state.itemDetail) {
        await this.getItemDetail(this.state.itemDetail.id);
      } else {
        await this.searchList({isNewest: true, page: 1});
      }
    } else {
      Toast.info(response.error.message);
    }
    return response;
  }
  @effect()
  public async searchList(options: Partial<ListSearch> = {}) {
    const listSearch: ListSearch = {...this.state.listSearch, ...options};
    const {listItems, listSummary} = await api.searchList(listSearch);
    this.updateState({listSearch, listItems, listSummary});
  }
  @effect()
  public async getItemDetail(itemDetailId: string) {
    const itemDetail = await api.getItemDetail(itemDetailId);
    this.updateState({itemDetail});
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(ModuleNames.comments, ModuleHandlers);
