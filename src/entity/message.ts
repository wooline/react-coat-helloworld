import {BaseListItem, BaseListSearch, BaseListSummary} from "./common";

export interface ListSearch extends BaseListSearch {
  title: string;
}
export interface ListItem extends BaseListItem {
  author: string;
  content: string;
  date: Date;
}
export type ListSummary = BaseListSummary;
export type ItemDetail = ListItem;
