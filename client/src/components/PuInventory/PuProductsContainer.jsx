import React from "react";
import { connect } from "react-redux";
import PuProducts from "./PuProducts";
import { compose } from "redux";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setSearchKeyword,
  setToggleIsFetching,
} from "../../redux/reducers/pu-products-reducer";

class PuProductsContainer extends React.Component {
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get("page") || 0;
    const search = urlParams.get("s") || "";
    this.props.getProducts(search, page);
    this.props.setSearchKeyword(search);
  }
  componentDidUpdate(prevProps) {
    if (this.props.currentPage !== prevProps.currentPage) {
      const newUrl = `${window.location.origin}${window.location.pathname}?page=${this.props.currentPage}&s=${this.props.searchKeyword}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  }
  onPageChanged = (p) => {
    this.props.getProducts(this.props.searchKeyword, p);
    const container = document.querySelector(".scroll-container");
    if (container) container.scrollTo(0, 0);
  };
  onSearch = (name) => {
    this.props.setSearchKeyword(name);
    this.props.getProducts(name, 0);
  };
  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <PuProducts
          products={this.props.products}
          onPageChanged={this.onPageChanged}
          onSearch={this.onSearch}
          searchKeyword={this.props.searchKeyword}
          totalCount={this.props.totalCount}
          totalPages={this.props.totalPages}
          currentPage={this.props.currentPage}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.puInventory.products,
    totalCount: state.puInventory.totalCount,
    totalPages: state.puInventory.totalPages,
    currentPage: state.puInventory.currentPage,
    searchKeyword: state.puInventory.searchKeyword,
    isFetching: state.puInventory.isFetching,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setSearchKeyword,
    setToggleIsFetching,
  })
)(PuProductsContainer);
