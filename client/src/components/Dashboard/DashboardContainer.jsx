import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Dashboard from "./Dashboard";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setToggleIsFetching,
  updateProducts,
  getStatus,
} from "./../../redux/reducers/inventory-reducer";

class DashboardContainer extends React.Component {
  vendor = null;
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.vendor = urlParams.get("vendor");
    this.props.getProducts(this.vendor);
    this.props.getStatus(this.vendor);
  }
  onPageChanged = (page, query) => {
    this.props.getProducts(this.vendor, page, query);
  };
  onFilterChanged = (page, query) => {
    this.props.getProducts(this.vendor, page, query);
  };
  onUpdateProducts = (query) => {
    this.props.updateProducts(this.vendor, query);
  };

  render() {
    return (
      <div className="container">
        {this.props.isFetching ? <Preloader /> : null}
        <Dashboard
          vendor={this.vendor}
          products={this.props.products}
          total={this.props.total}
          onUpdateProducts={this.onUpdateProducts}
          onPageChanged={this.onPageChanged}
          onFilterChanged={this.onFilterChanged}
          currentPage={this.props.currentPage}
          totalPages={this.props.totalPages}
          status={this.props.status}
        />
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    vendor: state.inventory.vendor,
    products: state.inventory.products,
    isFetching: state.inventory.isFetching,
    total: state.inventory.total,
    currentPage: state.inventory.currentPage,
    totalPages: state.inventory.totalPages,
    status: state.inventory.status,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setToggleIsFetching,
    updateProducts,
    getStatus,
  })
)(DashboardContainer);
