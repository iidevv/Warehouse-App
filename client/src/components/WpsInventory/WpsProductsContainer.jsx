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
  setToggleIsFetching
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
    const container = document.querySelector(".scroll-container");
    if (container) container.scrollTo(0, 0);
  };
  onSearch = (name) => {
    this.props.setSearchKeyword(name);
    this.props.getProducts(name, "");
  };
  onItemsSearch = (searchby, keyword, p) => {
    this.props.getItems(searchby, keyword, p);
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
          items={this.props.items}
          itemsCursor={this.props.itemsCursor}
          onItemsSearch={this.onItemsSearch}
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
    items: state.wpsInventory.items,
    itemsCursor: state.wpsInventory.itemsCursor,
    isFetching: state.wpsInventory.isFetching,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setSearchKeyword,
    getItems,
    setToggleIsFetching
  })
)(WpsProductsContainer);
