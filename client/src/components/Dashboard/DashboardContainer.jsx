import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Dashboard from "./Dashboard";
import Preloader from "../common/preloader/Preloader";

import {
  getProducts,
  setProducts,
  setToggleIsFetching,
} from "./../../redux/reducers/inventory-reducer";

class DashboardContainer extends React.Component {
  componentDidMount() {
    this.props.getProducts();
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Dashboard products={this.props.products} total={this.props.total} />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    products: state.inventory.products,
    isFetching: state.inventory.isFetching,
    total: state.inventory.total
  };
};

export default compose(
  // withAuthRedirect,
  connect(mapStateToProps, {
    getProducts,
    setProducts,
    setToggleIsFetching,
  })
)(DashboardContainer);
