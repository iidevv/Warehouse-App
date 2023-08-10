import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Preloader from "../common/preloader/Preloader";
import Catalog from "./Catalog.js";
import {
  getProducts,
  setOffset,
  setProducts,
  setSearch,
  setToggleIsFetching,
} from "../../redux/reducers/catalog-reducer";

class CatalogContainer extends React.Component {
  vendor = null;
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.vendor = urlParams.get("vendor");
    const offset = urlParams.get("offset") || "";
    const search = urlParams.get("search") || "";

    this.props.getProducts(this.vendor, offset, search);
  }
  componentDidUpdate(prevProps) {
    if (this.props.meta.current !== prevProps.meta.current) {
      const newUrl = `${window.location.origin}${window.location.pathname}?vendor=${this.vendor}&offset=${this.props.meta.current}&search=${this.props.search}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  }
  onPageChanged = (offset) => {
    this.props.getProducts(this.vendor, offset, this.props.search);
    const container = document.querySelector(".scroll-container");
    if (container) container.scrollTo(0, 0);
  };
  onSearch = (offset, search) => {
    this.props.setSearch(search);
    this.props.getProducts(this.vendor, offset, search);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Catalog
          vendor={this.vendor}
          products={this.props.products}
          meta={this.props.meta}
          search={this.props.search}
          onPageChanged={this.onPageChanged}
          onSearch={this.onSearch}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.catalog.products,
    search: state.catalog.search,
    searchBy: state.catalog.searchBy,
    meta: state.catalog.meta,
    isFetching: state.catalog.isFetching,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setSearch,
    setOffset,
    setToggleIsFetching,
  })
)(CatalogContainer);
