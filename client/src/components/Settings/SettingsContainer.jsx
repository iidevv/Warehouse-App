import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import TurnSettings from "./TurnSettings";
import LSSettings from "./LSSettings";

import {
  rebuildTurnProducts,
  getRebuildTurnStatus,
  uploadLSCatalog,
  uploadAmazonFile,
  syncCatalog,
  getSyncCatalogStatus,
} from "../../redux/reducers/settings-reducer";
import AmazonSettings from "./AmazonSettings";
import CatalogSettings from "./CatalogSettings";

class settingsContainer extends React.Component {
  componentDidMount() {
    this.props.getRebuildTurnStatus();

    if (this.props.turn_status.is_updating) {
      this.startPollingTurn();
    }

    this.props.getSyncCatalogStatus();
    if (this.props.sync_catalog_status.is_updating) {
      this.startPollingSync();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.turn_status.is_updating !== this.props.turn_status.is_updating
    ) {
      if (this.props.turn_status.is_updating) {
        this.startPollingTurn();
      } else {
        this.stopPollingTurn();
      }
    }

    if (
      prevProps.sync_catalog_status.is_updating !== this.props.sync_catalog_status.is_updating
    ) {
      if (this.props.sync_catalog_status.is_updating) {
        this.startPollingSync();
      } else {
        this.stopPollingSync();
      }
    }
  }

  componentWillUnmount() {
    this.stopPollingTurn();
    this.stopPollingSync();
  }

  startPollingTurn = () => {
    this.statusInterval = setInterval(() => {
      this.props.getRebuildTurnStatus();
    }, 5000);
  };

  stopPollingTurn = () => {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
    }
  };

  startPollingSync = () => {
    this.syncInterval = setInterval(() => {
      this.props.getSyncCatalogStatus();
    }, 5000);
  };

  stopPollingSync = () => {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  };

  onRebuildTurnProducts = () => {
    this.props.rebuildTurnProducts();
  };

  onUploadLSCatalog = (formData) => {
    this.props.uploadLSCatalog(formData);
  };

  onUploadAmazonFile = (formData) => {
    this.props.uploadAmazonFile(formData);
  };

  onSyncCatalog = () => {
    this.props.syncCatalog();
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
        <AmazonSettings
          onUploadAmazonFile={this.onUploadAmazonFile}
          amazon_file_status={this.props.amazon_file_status}
        />
        <CatalogSettings
          onSyncCatalog={this.onSyncCatalog}
          sync_catalog_status={this.props.sync_catalog_status}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    turn_status: state.settings.turn_status,
    catalog_status: state.settings.ls_catalog_status,
    amazon_file_status: state.settings.amazon_file_status,
    sync_catalog_status: state.settings.sync_catalog_status,
  };
};

export default compose(
  connect(mapStateToProps, {
    rebuildTurnProducts,
    getRebuildTurnStatus,
    uploadLSCatalog,
    uploadAmazonFile,
    syncCatalog,
    getSyncCatalogStatus,
  })
)(settingsContainer);
