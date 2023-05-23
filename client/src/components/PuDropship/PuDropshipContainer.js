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
    this.props.getOrders('', '', '');
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <PuDropship />
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
