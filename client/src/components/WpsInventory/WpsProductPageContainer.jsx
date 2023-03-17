import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import WpsProductPage from "./WpsProductPage";
import withRouter from "../../hoc/withRouter";
import Notifications from '../common/notifications/Notifications';
import {
  getProduct,
  setProduct,
  createBigcommerceProduct
} from "../../redux/reducers/wps-product-reducer";

class WpsProductContainer extends React.Component {
  constructor(props) {
    super(props);
    this.pushToCatalog = this.pushToCatalog.bind(this);
  }
  componentDidMount() {
    let id = this.props.params.id;
    if (!id) id = 1;
    this.props.getProduct(id);
  }
  pushToCatalog(data) {
    this.props.createBigcommerceProduct(data);
  }
  render() {
    return (
      <>
      <Notifications info={this.props.info}/>
      <WpsProductPage
        product={this.props.productData}
        pushToCatalog={this.pushToCatalog}
      />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    productData: state.wpsProduct.productData,
    info: state.wpsProduct.info,
  };
};

export default compose(
  connect(mapStateToProps, { setProduct, getProduct, createBigcommerceProduct }),
  // withAuthRedirect,
  withRouter
)(WpsProductContainer);
