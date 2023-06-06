import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Preloader from "../common/preloader/Preloader";
import Index from "./Index";


class IndexContainer extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Index />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
  };
};

export default compose(
  connect(mapStateToProps, {
  })
)(IndexContainer);
