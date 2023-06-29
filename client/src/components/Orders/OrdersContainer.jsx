import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import withRouter from "../../hoc/withRouter";
import Preloader from "../common/preloader/Preloader";
import {
  getOrders,
  setCurrentPage,
  createOrder,
} from "../../redux/reducers/orders-reducer";
import Orders from "./Orders";
import Notifications from '../common/notifications/Notifications';

class OrdersContainer extends React.Component {
  componentDidMount() {
    this.props.getOrders();
  }
  onPageChanged = (p) => {
    this.props.setCurrentPage(p);
    this.props.getOrders();
    const container = document.querySelector(".scroll-container");
    if (container) container.scrollTo(0, 0);
  };
  onCreateOrder = (id) => {
    this.props.createOrder(id);
  };
  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <Orders
          orders={this.props.orders}
          currentPage={this.props.currentPage}
          onPageChanged={this.onPageChanged}
          onCreateOrder={this.onCreateOrder}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    orders: state.orders.orders,
    currentPage: state.orders.currentPage,
    isFetching: state.orders.isFetching,
    info: state.orders.info,
  };
};

export default compose(
  connect(mapStateToProps, {
    getOrders,
    setCurrentPage,
    createOrder,
  }),
  withRouter
)(OrdersContainer);
