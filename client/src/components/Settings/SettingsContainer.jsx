import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import TurnSettings from "./TurnSettings";
import LSSettings from "./LSSettings";

import {
  rebuildTurnProducts,
  getRebuildTurnStatus,
  uploadLSCatalog,
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

  onUploadLSCatalog = (formData) => {
    this.props.uploadLSCatalog(formData);
  };

  render() {
    return (
      <>
        <TurnSettings
          onRebuildTurnProducts={this.onRebuildTurnProducts}
          status={this.props.turn_status}
        />
        <LSSettings
          onUploadLSCatalog={this.onUploadLSCatalog}
          catalog_status={this.props.catalog_status}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    turn_status: state.settings.turn_status,
    catalog_status: state.settings.ls_catalog_status,
  };
};

export default compose(
  connect(mapStateToProps, {
    rebuildTurnProducts,
    getRebuildTurnStatus,
    uploadLSCatalog,
  })
)(settingsContainer);
