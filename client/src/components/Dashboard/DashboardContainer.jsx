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
  componentDidMount() {
    this.props.getProducts();
    this.props.getStatus();
  }
  onPageChanged = (name, page, status, search) => {
    this.props.getProducts(name, page, status, search);
  };
  onFilterChanged = (name, page, status, search) => {
    this.props.getProducts(name, page, status, search);
  };
  onDeleteProduct = (id) => {
    this.props.deleteProduct(id);
  };
  onUpdateProducts = (vendor_id, name, status) => {
    this.props.updateProducts(vendor_id, name, status);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Dashboard
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
