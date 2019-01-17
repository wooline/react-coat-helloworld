import request from "common/request";
import {ItemCreateData, ItemDetail, ListItem, ListSearch, ListSummary} from "entity/comment";
import {DefaultResult} from "entity/common";

export class API {
  public searchList(listSearch: ListSearch) {
    listSearch = {...listSearch};
    delete listSearch.articleType;
    return request<{listItems: ListItem[]; listSummary: ListSummary}>("get", "/ajax/comments", listSearch).then(reslut => {
      reslut.listItems.forEach(item => {
        item.avatarUrl = InitEnv.clientPublicPath + item.avatarUrl;
      });
      return reslut;
    });
  }
  public getItemDetail(id: string) {
    return request<ItemDetail>("get", "/ajax/comments/:id", {id}).then(reslut => {
      reslut.avatarUrl = InitEnv.clientPublicPath + reslut.avatarUrl;
      reslut.repliesList.forEach(item => {
        item.avatarUrl = InitEnv.clientPublicPath + item.avatarUrl;
      });
      return reslut;
    });
  }
  public createItem(item: ItemCreateData) {
    return request<DefaultResult>("post", "/ajax/comments", {}, item);
  }
}

export default new API();
