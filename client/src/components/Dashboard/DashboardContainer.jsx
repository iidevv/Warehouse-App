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
  updateProducts
} from "./../../redux/reducers/inventory-reducer";

class DashboardContainer extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }
  onPageChanged = (name, page) => {
    this.props.getProducts(name, page);
  }
  onDeleteProduct = (id) => {
    this.props.deleteProduct(id);
  }
  onUpdateProducts = () => {
    this.props.updateProducts();
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Dashboard products={this.props.products} total={this.props.total} onDeleteProduct={this.onDeleteProduct} onUpdateProducts={this.onUpdateProducts} onPageChanged={this.onPageChanged} currentPage={this.props.currentPage} totalPages={this.props.totalPages} />
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
    totalPages: state.inventory.totalPages
  };
};

export default compose(
  // withAuthRedirect,
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setToggleIsFetching,
    deleteProduct,
    updateProducts
  })
)(DashboardContainer);
