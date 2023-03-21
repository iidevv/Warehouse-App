import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import WpsProductPage from "./WpsProductPage";
import withRouter from "../../hoc/withRouter";
import Preloader from "../common/preloader/Preloader";
import Notifications from "../common/notifications/Notifications";
import {
  getProduct,
  setProduct,
  createBigcommerceProduct,
  setToggleIsFetching,
  searchCategories,
  setCategories,
  setCategory,
  resetCategories
} from "../../redux/reducers/wps-product-reducer";

class WpsProductContainer extends React.Component {
  componentDidMount() {
    let id = this.props.params.id;
    if (!id) id = 1;
    this.props.getProduct(id);
    this.props.setCategory(localStorage.getItem('category_name'), localStorage.getItem('category_id'));
  }
  pushToCatalog = (data) => {
    data.categories = {
      id: +localStorage.getItem('category_id')
    }
    this.props.createBigcommerceProduct(data);
  }
  onSearchCategories = (query) => {
    this.props.searchCategories(query);
  }
  onSetCategory = () => {
    this.props.setCategory(localStorage.getItem('category_name'), localStorage.getItem('category_id'));
    this.props.resetCategories();
  }
  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <WpsProductPage
          product={this.props.productData}
          pushToCatalog={this.pushToCatalog}
          onSearchCategories={this.onSearchCategories}
          onSetCategory={this.onSetCategory}
          categories={this.props.categories}
          current_category={this.props.current_category}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    productData: state.wpsProduct.productData,
    info: state.wpsProduct.info,
    isFetching: state.wpsProduct.isFetching,
    categories: state.wpsProduct.categories,
    current_category: state.wpsProduct.current_category
  };
};

export default compose(
  connect(mapStateToProps, {
    setProduct,
    getProduct,
    createBigcommerceProduct,
    setToggleIsFetching,
    searchCategories,
    setCategories,
    setCategory,
    resetCategories
  }),
  // withAuthRedirect,
  withRouter
)(WpsProductContainer);
