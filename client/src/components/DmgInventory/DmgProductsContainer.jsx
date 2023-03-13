import React from "react";
import { connect } from "react-redux";
import DmgProducts from "./DmgProducts";
import { compose } from "redux";

import {
  getProducts,
  setProducts,
} from "./../../redux/reducers/dmg-inventory-reducer";

class DmgProductsContainer extends React.Component {
  componentDidMount() {
    this.props.getProducts(this.props.currentPage, this.props.pageSize);
  }

  render() {
    return (
      <>
        <DmgProducts
          products={this.props.products}
          currentPage={this.props.currentPage}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.dmgInventory.products,
    pageSize: state.dmgInventory.pageSize,
    totalCount: state.dmgInventory.totalCount,
    currentPage: state.dmgInventory.currentPage,
  };
};

export default compose(
  // withAuthRedirect,
  connect(mapStateToProps, {
    getProducts,
    setProducts
  })
)(DmgProductsContainer);
