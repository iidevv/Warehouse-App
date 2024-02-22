import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Channel from "./Channel";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setToggleIsFetching,
  updateProducts,
  refreshProducts,
} from "./../../redux/reducers/channel-reducer";

const Notifications = (props) => {
  const notificationExist = props.info.message ? true : false;
  return (
    <>
      {notificationExist && (
        <div
          className="fixed right-10 top-10 flex ml-auto border border-blue-500 items-center p-4 mb-4 text-gray-500 bg-white rounded-lg shadow z-10"
          role="alert"
        >
          <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
            </svg>
            <span className="sr-only">Check icon</span>
          </div>
          <div className="ml-3 text-sm font-normal">{props.info.message}</div>
        </div>
      )}
    </>
  );
};

class ChannelContainer extends React.Component {
  vendor = null;
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.vendor = urlParams.get("vendor");
    this.props.getProducts(this.vendor);
  }
  onPageChanged = (query, page) => {
    this.props.getProducts(this.vendor, query, page);
  };
  onFilterChanged = (query) => {
    this.props.getProducts(this.vendor, query);
  };
  onUpdateProducts = () => {
    this.props.updateProducts(this.vendor);
  };
  onRefreshProducts = () => {
    this.props.refreshProducts(this.vendor);
  };

  render() {
    return (
      <div className="container">
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <Channel
          vendor={this.vendor}
          products={this.props.products}
          pagination={this.props.pagination}
          query={this.props.query}
          total={this.props.total}
          onUpdateProducts={this.onUpdateProducts}
          onRefreshProducts={this.onRefreshProducts}
          onPageChanged={this.onPageChanged}
          onFilterChanged={this.onFilterChanged}
          status={this.props.status}
        />
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    vendor: state.channel.vendor,
    products: state.channel.products,
    isFetching: state.channel.isFetching,
    total: state.channel.total,
    pagination: state.channel.pagination,
    query: state.channel.query,
    status: state.channel.status,
    info: state.channel.info,
  };
};

export default compose(
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setToggleIsFetching,
    updateProducts,
    refreshProducts,
  })
)(ChannelContainer);
