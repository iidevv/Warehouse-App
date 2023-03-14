import React from "react";
import { connect } from "react-redux";
import WpsProducts from "./WpsProducts";
import { compose } from "redux";

import {
  getProducts,
  setProducts,
} from "../../redux/reducers/wps-inventory-reducer";

class WpsProductsContainer extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    return (
      <>
        <WpsProducts
          products={this.props.products}
          currentPage={this.props.currentPage}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.wpsInventory.products,
    currentPage: state.wpsInventory.currentPage,
  };
};

export default compose(
  // withAuthRedirect,
  connect(mapStateToProps, {
    getProducts,
    setProducts
  })
)(WpsProductsContainer);
