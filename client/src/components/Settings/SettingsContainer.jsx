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

    if (this.props.turn_status.is_updating) {
      this.startPolling();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.turn_status.is_updating !== this.props.turn_status.is_updating
    ) {
      if (this.props.turn_status.is_updating) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    }
  }

  componentWillUnmount() {
    this.stopPolling();
  }

  startPolling = () => {
    this.statusInterval = setInterval(() => {
      this.props.getRebuildTurnStatus();
    }, 5000);
  };

  stopPolling = () => {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  };

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
