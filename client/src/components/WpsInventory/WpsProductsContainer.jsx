import React from "react";
import { connect } from "react-redux";
import WpsProducts from "./WpsProducts";
import { compose } from "redux";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setSearchKeyword,
  setToggleIsFetching,
} from "../../redux/reducers/wps-products-reducer";

class WpsProductsContainer extends React.Component {
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cursor = urlParams.get("cursor") || "";
    const search = urlParams.get("s") || "";
    this.props.getProducts(search, cursor);
    this.props.setSearchKeyword(search);
  }
  componentDidUpdate(prevProps) {
    if (this.props.cursor.current !== prevProps.cursor.current) {
      const newUrl = `${window.location.origin}${window.location.pathname}?cursor=${this.props.cursor.current}&s=${this.props.searchKeyword}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  }
  onCursorChanged = (p) => {
    this.props.getProducts(this.props.searchKeyword, p);
  };
  onSearch = (name) => {
    this.props.setSearchKeyword(name);
    this.props.getProducts(name, "");
  };

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
    isFetching: state.wpsInventory.isFetching,
  };
};

export default compose(
  // withAuthRedirect,
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setSearchKeyword,
    setToggleIsFetching,
  })
)(WpsProductsContainer);
