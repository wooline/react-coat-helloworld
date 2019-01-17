import {BaseListItem, BaseListSearch, BaseListSummary} from "./common";

export interface ListSearch extends BaseListSearch {
  title: string;
}
export interface ListItem extends BaseListItem {
  title: string;
  departure: string;
  type: string;
  hot: number;
  price: number;
  coverUrl: string;
  comments: number;
}
export type ListSummary = BaseListSummary;

export interface ItemDetail extends ListItem {
  remark: string;
  picList: string[];
}
