import {Pagination} from "antd-mobile";
import {stringifyQuery, toUrl} from "common/routers";
import Search from "components/Search";
import {routerActions} from "connected-react-router";
import {ListItem, ListSearch, ListSummary} from "entity/message";
import {RootState} from "modules";
import appModule from "modules/app/facade";
import {defaultListSearch} from "modules/messages/facade";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  showSearch: boolean;
  listSearch: ListSearch | undefined;
  listItems: ListItem[] | undefined;
  listSummary: ListSummary | undefined;
}

class Component extends React.PureComponent<Props> {
  private onPageChange = (page: number) => {
    const listSearch = {...this.props.listSearch, page};
    const search = stringifyQuery("search", listSearch, defaultListSearch);
    this.props.dispatch(routerActions.push(toUrl("/messages", search)));
  };

  private onSearch = (title: string) => {
    const listSearch = {...this.props.listSearch, title, page: 1};
    const search = stringifyQuery("search", listSearch, defaultListSearch);
    this.props.dispatch(routerActions.push(toUrl("/messages", search)));
  };

  private onSearchClose = () => {
    this.props.dispatch(appModule.actions.putShowSearch(false));
    if (this.props.listSearch!.title) {
      this.onSearch("");
    }
  };

  public render() {
    const {showSearch, listSearch, listItems, listSummary} = this.props;

    if (listItems && listSearch) {
      return (
        <div className={`${ModuleNames.messages}-List`}>
          <Search value={listSearch.title} onClose={this.onSearchClose} onSearch={this.onSearch} visible={showSearch} />
          <div className="list-items">
            {listItems.map(item => (
              <div key={item.id}>
                <div className="author">{item.author}</div>
                <div className="date">{item.date.toUTCString()}</div>
                <div className="content">{item.content}</div>
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
}

const mapStateToProps = (state: RootState) => {
  const model = state.messages;
  return {
    showSearch: Boolean(state.app.showSearch),
    listSearch: model.listSearch,
    listItems: model.listItems,
    listSummary: model.listSummary,
  };
};

export default connect(mapStateToProps)(Component);
