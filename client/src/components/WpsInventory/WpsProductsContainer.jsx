import React from "react";
import { connect } from "react-redux";
import WpsProducts from "./WpsProducts";
import { compose } from "redux";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setSearchKeyword,
  getItems,
  setToggleIsFetching,
} from "../../redux/reducers/wps-products-reducer";

class WpsProductsContainer extends React.Component {
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const cursor = urlParams.get("cursor") || "";
    const searchby = urlParams.get("q") || "name";
    const search = urlParams.get("s") || "";
    this.props.setSearchKeyword(search);
    this.props.getItems(searchby, search, cursor);
  }
  componentDidUpdate(prevProps) {
    if (this.props.itemsCursor.current !== prevProps.itemsCursor.current) {
      const newUrl = `${window.location.origin}${window.location.pathname}?cursor=${this.props.itemsCursor.current}&s=${this.props.searchKeyword}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }
  }
  onItemsPageChanged = (searchby, keyword, p) => {
    this.props.getItems(searchby, keyword, p);
    const container = document.querySelector(".scroll-container");
    if (container) container.scrollTo(0, 0);
  };
  onSearch = (name) => {
    this.props.getProducts(name, "");
  };
  onItemsSearch = (searchby, keyword, p) => {
    this.props.setSearchKeyword(keyword);
    this.props.getItems(searchby, keyword, p);
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
          items={this.props.items}
          itemsCursor={this.props.itemsCursor}
          onItemsSearch={this.onItemsSearch}
          onItemsPageChanged={this.onItemsPageChanged}
          searchKeyword={this.props.searchKeyword}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.wpsProducts.products,
    cursor: state.wpsProducts.cursor,
    searchKeyword: state.wpsProducts.searchKeyword,
    items: state.wpsProducts.items,
    itemsCursor: state.wpsProducts.itemsCursor,
    isFetching: state.wpsProducts.isFetching,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setSearchKeyword,
    getItems,
    setToggleIsFetching,
  })
)(WpsProductsContainer);
