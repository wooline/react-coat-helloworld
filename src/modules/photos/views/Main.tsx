import {RootState} from "modules";
import * as React from "react";
import {connect} from "react-redux";
import {Route, Switch} from "react-router-dom";
import DetailsView from "./Details";
import ListView from "./List";

interface Props {
  pathname: string;
}
class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <Switch>
        <Route exact={true} path="/photos/:id" component={DetailsView} />
        <Route component={ListView} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
