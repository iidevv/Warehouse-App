import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import TurnSettings from "./TurnSettings";

import {
  rebuildTurnProducts,
  getRebuildTurnStatus,
} from "../../redux/reducers/settings-reducer";

class settingsContainer extends React.Component {
  componentDidMount() {
    this.props.getRebuildTurnStatus();
  }

  onRebuildTurnProducts = () => {
    this.props.rebuildTurnProducts();
  };

  render() {
    return (
      <>
        <TurnSettings
          onRebuildTurnProducts={this.onRebuildTurnProducts}
          status={this.props.turn_status}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    turn_status: state.settings.turn_status,
  };
};

export default compose(
  connect(mapStateToProps, {
    rebuildTurnProducts,
    getRebuildTurnStatus,
  })
)(settingsContainer);
