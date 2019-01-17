import {BaseListItem, BaseListSearch, BaseListSummary} from "./common";

export interface ListItem extends BaseListItem {
  title: string;
  hot: number;
  coverUrl: string;
  videoUrl: string;
}

export interface ListSearch extends BaseListSearch {
  title: string;
}

export type ListSummary = BaseListSummary;
export type ItemDetail = ListItem;
