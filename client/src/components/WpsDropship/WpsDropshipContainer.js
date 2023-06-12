import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import withRouter from "../../hoc/withRouter";
import Preloader from "../common/preloader/Preloader";
import WpsDropship from "./WpsDropship";
import { getFormattedDate } from "../../common/index.js";
import { getOrders } from "../../redux/reducers/wps-dropship-reducer";

class WpsDropshipContainer extends React.Component {
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const from = urlParams.get("date-from")
      ? urlParams.get("date-from").replace(/-/g, "")
      : "20220101";
    const to = urlParams.get("date-to")
      ? urlParams.get("date-to").replace(/-/g, "")
      : getFormattedDate("", "non-dashed");
    this.props.getOrders(from, to, 1);
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <WpsDropship orders={this.props.orders} />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    orders: state.wpsDropship.orders,
    currentPage: state.wpsDropship.currentPages,
    totalPages: state.wpsDropship.totalPages,
  };
};

export default compose(
  connect(mapStateToProps, {
    getOrders,
  }),
  withRouter
)(WpsDropshipContainer);
