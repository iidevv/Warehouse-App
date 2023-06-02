import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import withRouter from "../../hoc/withRouter";
import Preloader from "../common/preloader/Preloader";
import PuDropship from "./PuDropship";
import {
  getOrders,
} from "./../../redux/reducers/pu-dropship-reducer";

class PuDropshipContainer extends React.Component {
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const from = urlParams.get("date-from") || '2022-01-01';
    const to = urlParams.get("date-to") || '2033-01-01';
    this.props.getOrders(from, to, 1);
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <PuDropship orders={this.props.orders} />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    orders: state.puDropship.orders,
    currentPage: state.puDropship.currentPages,
    totalPages: state.puDropship.totalPages,
  };
};

export default compose(
  connect(mapStateToProps, {
    getOrders
  }),
  withRouter
)(PuDropshipContainer);
