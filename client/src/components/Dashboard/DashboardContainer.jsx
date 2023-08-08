import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Dashboard from "./Dashboard";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setToggleIsFetching,
  deleteProduct,
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
  onPageChanged = (name, page, status, search) => {
    this.props.getProducts(this.vendor, name, page, status, search);
  };
  onFilterChanged = (name, page, status, search) => {
    this.props.getProducts(this.vendor, name, page, status, search);
  };
  onDeleteProduct = (id) => {
    this.props.deleteProduct(this.vendor, id);
  };
  onUpdateProducts = (vendor_id, name, status) => {
    this.props.updateProducts(this.vendor, vendor_id, name, status);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Dashboard
          vendor={this.vendor}
          products={this.props.products}
          total={this.props.total}
          onDeleteProduct={this.onDeleteProduct}
          onUpdateProducts={this.onUpdateProducts}
          onPageChanged={this.onPageChanged}
          onFilterChanged={this.onFilterChanged}
          currentPage={this.props.currentPage}
          totalPages={this.props.totalPages}
          status={this.props.status}
        />
      </>
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
    deleteProduct,
    updateProducts,
    getStatus,
  })
)(DashboardContainer);
