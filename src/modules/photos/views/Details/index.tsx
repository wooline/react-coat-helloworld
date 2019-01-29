import {Carousel, Icon as MIcon} from "antd-mobile";
import {stringifyQuery, toUrl} from "common/routers";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {ItemDetail, ListSearch} from "entity/photo";
import {RootState} from "modules";
import {Main as Comments} from "modules/comments/views";
import {ModuleNames} from "modules/names";
import {defaultListSearch} from "modules/photos/facade";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  listSearch: ListSearch | undefined;
  itemDetail: ItemDetail | undefined;
}

interface State {
  moreDetail: boolean;
  showComment: boolean;
}

class Component extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps(nextProps: Props, prevState: State): State | null {
    if (!nextProps.itemDetail) {
      return {moreDetail: false, showComment: false};
    }
    return null;
  }
  public state: State = {
    moreDetail: false,
    showComment: false,
  };

  private onMoreRemark = () => {
    this.setState({moreDetail: !this.state.moreDetail});
  };
  private onShowComment = () => {
    this.setState({showComment: !this.state.showComment});
  };
  private onClose = () => {
    const listSearch = {...this.props.listSearch};
    const search = stringifyQuery("search", listSearch, defaultListSearch);
    this.props.dispatch(routerActions.push(toUrl("/photos", search)));
  };

  public render() {
    const {itemDetail} = this.props;
    const {moreDetail, showComment} = this.state;
    if (itemDetail) {
      return (
        <div className={`${ModuleNames.photos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2>{itemDetail.title}</h2>
            <span className="close-button" onClick={this.onClose}>
              <MIcon size="md" type="cross-circle" />
            </span>
          </div>
          <div className={"remark" + (moreDetail ? " on" : "")} onClick={this.onMoreRemark}>
            {itemDetail.remark}
          </div>
          <div className="content">
            <Carousel className="player" autoplay={false} infinite={true}>
              {itemDetail.picList.map(url => (
                <div className="g-pre-img" key={url}>
                  <div className="pic" style={{backgroundImage: `url(${url})`}} />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="comment-bar" onClick={this.onShowComment}>
            <span>
              <Icon type={IconClass.HEART} />
              <br />
              {itemDetail.hot}
            </span>
            <span>
              <Icon type={IconClass.MESSAGE} />
              <br />
              {itemDetail.comments}
            </span>
          </div>
          <div className={"comments-panel" + (showComment ? " on" : "")}>
            <div onClick={this.onShowComment} className="mask" />
            <div className="dialog">
              <Comments />
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
  private fadeIn() {
    const dom = findDOMNode(this) as HTMLElement;
    if (dom && dom.className.indexOf("g-enter-in") > -1) {
      setTimeout(() => {
        dom.className = dom.className.replace("g-enter-in", "");
      }, 0);
    }
  }
  public componentDidUpdate() {
    this.fadeIn();
  }
  public componentDidMount() {
    this.fadeIn();
  }
}

const mapStateToProps = (state: RootState) => {
  const model = state.photos!;
  return {
    listSearch: model.listSearch,
    itemDetail: model.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
