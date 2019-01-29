import {TabBar} from "antd-mobile";
import {UnauthorizedError} from "common/Errors";
import Icon, {IconClass} from "components/Icon";
import {routerActions} from "connected-react-router";
import {RootState} from "modules";
import React from "react";
import {errorAction} from "react-coat";
import {connect, DispatchProp} from "react-redux";
import "./index.less";

interface Props extends DispatchProp {
  pathname: string;
  hasLogin: boolean;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const {pathname, dispatch} = this.props;

    return (
      <div className="app-BottomNav g-doc-width">
        <TabBar noRenderContent={true} barTintColor="#108ee9" tintColor="#ff0" unselectedTintColor="#fff">
          <TabBar.Item
            icon={<Icon type={IconClass.PICTURE} />}
            selectedIcon={<Icon type={IconClass.PICTURE} />}
            title="组团"
            key="photos"
            selected={pathname.indexOf("/photos") === 0}
            onPress={() => {
              dispatch(routerActions.push("/photos#refresh=true"));
            }}
          />
          <TabBar.Item
            title="分享"
            key="videos"
            icon={<Icon type={IconClass.LIVE} />}
            selectedIcon={<Icon type={IconClass.LIVE} />}
            selected={pathname.indexOf("/videos") === 0}
            onPress={() => {
              dispatch(routerActions.push("/videos#refresh=true"));
            }}
          />
          <TabBar.Item
            icon={<Icon type={IconClass.MESSAGE} />}
            selectedIcon={<Icon type={IconClass.MESSAGE} />}
            title="消息"
            key="messages"
            selected={pathname.indexOf("/messages") === 0}
            onPress={() => {
              if (!this.props.hasLogin) {
                this.props.dispatch(errorAction(new UnauthorizedError()));
              } else {
                dispatch(routerActions.push("/messages#refresh=true"));
              }
            }}
          />
        </TabBar>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
    hasLogin: state.app!.curUser!.hasLogin,
  };
};

export default connect(mapStateToProps)(Component);
