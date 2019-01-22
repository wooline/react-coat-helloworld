import {Pagination} from "antd-mobile";
import {ListItem, ListSearch, ListSummary} from "entity/comment";
import {RootState} from "modules";
import thisModule from "modules/comments/facade";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}
let scrollTop = NaN;
class Component extends React.PureComponent<Props> {
  private onPageChange = (page: number) => {
    this.props.dispatch(thisModule.actions.searchList({page}));
  };
  private onSortChange = (isNewest: boolean) => {
    this.props.dispatch(thisModule.actions.searchList({isNewest, page: 1}));
  };
  private onItemClick = (id: string) => {
    // 记住当前滚动位置
    const dom = findDOMNode(this) as HTMLElement;
    scrollTop = (dom.parentNode as HTMLDivElement).scrollTop;
    this.props.dispatch(thisModule.actions.getItemDetail(id));
  };

  public render() {
    const {listSearch, listItems, listSummary} = this.props;
    if (listItems && listSearch) {
      return (
        <div className={`${ModuleNames.comments}-List`}>
          <div className="list-header">
            <div onClick={() => this.onSortChange(false)} className={listSearch.isNewest ? "" : "on"}>
              最热
            </div>
            <div onClick={() => this.onSortChange(true)} className={listSearch.isNewest ? "on" : ""}>
              最新
            </div>
          </div>
          <div className="list-items">
            {listItems.map(item => (
              <div onClick={() => this.onItemClick(item.id)} className="g-border-top" key={item.id}>
                <div className="avatar" style={{backgroundImage: `url(${item.avatarUrl})`}} />
                <div className="user">
                  {item.username}
                  <span className="date">{item.createdTime}</span>
                </div>
                <div className="content">{item.content}</div>
                <span className="reply">
                  <span className="act">回复</span>({item.replies})
                </span>
              </div>
            ))}
          </div>
          {listSummary && (
            <div className="g-pagination">
              <Pagination current={listSummary.page} total={listSummary.totalPages} onChange={this.onPageChange} />
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  }
  public componentDidUpdate() {
    this.scroll();
  }
  public componentDidMount() {
    this.scroll();
  }
  private scroll() {
    // 恢复记住的滚动位置
    const dom = findDOMNode(this) as HTMLElement;
    if (dom) {
      (dom.parentNode as HTMLDivElement).scrollTop = scrollTop;
      scrollTop = 0;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.comments;
  return {
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
