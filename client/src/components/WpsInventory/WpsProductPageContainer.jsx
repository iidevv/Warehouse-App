import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import WpsProductPage from "./WpsProductPage";
import withRouter from "../../hoc/withRouter";
import {
  getProduct,
  setProduct,
} from "../../redux/reducers/wps-product-reducer";

class WpsProductContainer extends React.Component {
  componentDidMount() {
    let id = this.props.params.id;
    if (!id) id = 1;
    this.props.getProduct(id);
  }
  render() {
    return (
      <WpsProductPage
        {...this.props.productData}
      />
    );
  }
}

let mapStateToProps = (state) => {
  return {
    productData: state.wpsProduct.productData,
  };
};

export default compose(
  connect(mapStateToProps, { setProduct, getProduct }),
  // withAuthRedirect,
  withRouter
)(WpsProductContainer);
