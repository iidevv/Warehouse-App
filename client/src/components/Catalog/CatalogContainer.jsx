import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { useLocation } from "react-router-dom";
import Preloader from "../common/preloader/Preloader";
import Catalog from "./Catalog.js";
import {
  getProducts,
  setOffset,
  setVendor,
  setProducts,
  setSearch,
  setToggleIsFetching,
} from "../../redux/reducers/catalog-reducer";

function CatalogContainer({
  meta,
  search,
  vendor,
  products,
  isFetching,
  getProducts,
  setVendor,
  setSearch,
}) {
  const location = useLocation();
  const searchTimeout = useRef(null);
  const prevMeta = useRef();
  const prevSearch = useRef();

  useEffect(() => {
    const { vendor, offset, search } = parseUrlParams();
    if (vendor) {
      getProducts(vendor, offset, search);
    }
  }, [location]);

  useEffect(() => {
    if (meta.current !== prevMeta.current || search !== prevSearch.current) {
      console.log("used");
      const newUrl = `${window.location.origin}${window.location.pathname}?vendor=${vendor}&offset=${meta.current}&search=${search}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    }

    prevMeta.current = meta;
    prevSearch.current = search;
  }, [meta, search, vendor]);

  const parseUrlParams = () => {
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const vendorFromUrl = urlParams.get("vendor");
    const offset = urlParams.get("offset");
    const searchFromUrl = urlParams.get("search");

    if (vendorFromUrl !== null) setVendor(vendorFromUrl);
    if (searchFromUrl !== null) setSearch(searchFromUrl);

    return { vendor: vendorFromUrl, offset, search: searchFromUrl };
  };

  const onPageChanged = (offset) => {
    getProducts(vendor, offset, search);
    const container = document.querySelector(".scroll-container");
    if (container) container.scrollTo(0, 0);
  };

  const onSearch = (offset, search) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    setSearch(search);
    searchTimeout.current = setTimeout(() => {
      getProducts(vendor, offset, search);
    }, 500);
  };

  return (
    <>
      {isFetching ? <Preloader /> : null}
      <Catalog
        vendor={vendor}
        products={products}
        meta={meta}
        search={search}
        onPageChanged={onPageChanged}
        onSearch={onSearch}
      />
    </>
  );
}

let mapStateToProps = (state) => {
  return {
    products: state.catalog.products,
    search: state.catalog.search,
    vendor: state.catalog.vendor,
    searchBy: state.catalog.searchBy,
    meta: state.catalog.meta,
    isFetching: state.catalog.isFetching,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setVendor,
    setSearch,
    setOffset,
    setToggleIsFetching,
  })
)(CatalogContainer);
