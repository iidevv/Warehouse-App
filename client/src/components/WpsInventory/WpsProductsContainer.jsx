import React from "react";
import { connect } from "react-redux";
import WpsProducts from "./WpsProducts";
import { compose } from "redux";
import Preloader from '../common/preloader/Preloader';

import {
  getProducts,
  setProducts,
  setSearchKeyword,
  setToggleIsFetching
} from "../../redux/reducers/wps-inventory-reducer";

class WpsProductsContainer extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }
  onCursorChanged = (p) => {
    this.props.getProducts(this.props.searchKeyword, p);
  }
  onSearch = (name) => {
    this.props.setSearchKeyword(name);
    this.props.getProducts(name, "");
  }

  render() {
    return (
      <>
      {this.props.isFetching ? <Preloader /> : null}
        <WpsProducts
          products={this.props.products}
          cursor={this.props.cursor}
          onCursorChanged={this.onCursorChanged}
          onSearch={this.onSearch}
          searchKeyword={this.props.searchKeyword}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.wpsInventory.products,
    cursor: state.wpsInventory.cursor,
    searchKeyword: state.wpsInventory.searchKeyword,
    isFetching: state.wpsInventory.isFetching
  };
};

export default compose(
  // withAuthRedirect,
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setSearchKeyword,
    setToggleIsFetching
  })
)(WpsProductsContainer);
