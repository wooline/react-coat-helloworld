import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect} from "react-redux";
import DetailsView from "./Details";
import Editor from "./Editor";
import ListView from "./List";
import "./Main.less";

interface Props {
  showDetail: boolean;
}

class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <div className={`${ModuleNames.comments}`}>
        <div className="wrap">{this.props.showDetail ? <DetailsView /> : <ListView />}</div>
        <Editor />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    showDetail: Boolean(state.comments.itemDetail),
  };
};

export default connect(mapStateToProps)(Component);
