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
  onPageChanged = (query, page) => {
    this.props.getProducts(this.vendor, query, page);
  };
  onFilterChanged = (query) => {
    this.props.getProducts(this.vendor, query);
  };
  onUpdateProducts = (query, bulk) => {
    this.props.updateProducts(this.vendor, query, bulk);
  };

  render() {
    return (
      <div className="container">
        {this.props.isFetching ? <Preloader /> : null}
        <Dashboard
          vendor={this.vendor}
          products={this.props.products}
          pagination={this.props.pagination}
          query={this.props.query}
          total={this.props.total}
          onUpdateProducts={this.onUpdateProducts}
          onPageChanged={this.onPageChanged}
          onFilterChanged={this.onFilterChanged}
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
    pagination: state.inventory.pagination,
    query: state.inventory.query,
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
