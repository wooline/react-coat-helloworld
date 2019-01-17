import {Icon as MIcon} from "antd-mobile";
import {stringifyQuery, toUrl} from "common/routers";
import {routerActions} from "connected-react-router";
import {ItemDetail, ListSearch} from "entity/video";
import {RootState} from "modules";
import {Main as Comments} from "modules/comments/views";
import {ModuleNames} from "modules/names";
import {defaultListSearch} from "modules/videos/facade";
import React from "react";
import {findDOMNode} from "react-dom";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  listSearch: ListSearch | undefined;
  itemDetail: ItemDetail | undefined;
}

class Component extends React.PureComponent<Props> {
  private onClose = () => {
    const listSearch = {...this.props.listSearch};
    const search = stringifyQuery("search", listSearch, defaultListSearch);
    this.props.dispatch(routerActions.push(toUrl("/videos", search)));
  };

  public render() {
    const {itemDetail} = this.props;
    if (itemDetail) {
      return (
        <div className={`${ModuleNames.videos}-Details g-details g-doc-width g-modal g-enter-in`}>
          <div className="subject">
            <h2 />
            <span onClick={this.onClose} className="close-button">
              <MIcon size="md" type="cross-circle" />
            </span>
          </div>
          <div className="content">
            <video
              width="100%"
              height="100%"
              autoPlay={true}
              controls={true}
              preload="auto"
              muted={false}
              playsInline={true}
              poster={itemDetail.coverUrl}
              onError={() => this.setState({message: "暂无视频！"})}
            >
              <source src={itemDetail.videoUrl} type="video/mp4" />
            </video>
          </div>
          <div className="comments-panel">
            <Comments />
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
  const model = state.videos;
  return {
    listSearch: model.listSearch,
    itemDetail: model.itemDetail,
  };
};

export default connect(mapStateToProps)(Component);
