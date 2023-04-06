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
  resetCategories,
  setHandleContentChange,
  removeVariantImage,
  changeVariantName,
  getChatgptContent
} from "../../redux/reducers/wps-product-reducer";

class WpsProductContainer extends React.Component {
  componentDidMount() {
    let id = this.props.params.id;
    if (!id) id = 1;
    this.props.getProduct(id);
    this.props.setCategory(
      localStorage.getItem("category_name"),
      localStorage.getItem("category_id")
    );
  }
  pushToCatalog = (data) => {
    data.page_title = this.props.content.page_title;
    data.search_keywords = this.props.content.search_keywords;
    data.meta_keywords = this.props.content.meta_keywords.split(", ");
    data.meta_description = this.props.content.meta_description;
    data.description = this.props.content.description;
    data.categories = {
      id: +localStorage.getItem("category_id"),
    };
    // data.images = data.images.filter((image) => image);
    this.props.createBigcommerceProduct(data);
  };
  onSearchCategories = (query) => {
    this.props.searchCategories(query);
  };
  onSetCategory = () => {
    this.props.setCategory(
      localStorage.getItem("category_name"),
      localStorage.getItem("category_id")
    );
    this.props.resetCategories();
  };
  onHandleContentChange = (id, value) => {
    this.props.setHandleContentChange(id, value);
  };
  onHandleRemoveVariantImage = (id, image_url) => {
    this.props.removeVariantImage(id, image_url);
  }
  onHandleChangeVariantName = (id, name) => {
    this.props.changeVariantName(id, name);
  }
  onGetChatgptContent = (contentField, text) => {
    this.props.getChatgptContent(contentField, text);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <WpsProductPage
          product={this.props.productData}
          content={this.props.content}
          pushToCatalog={this.pushToCatalog}
          onSearchCategories={this.onSearchCategories}
          onSetCategory={this.onSetCategory}
          onHandleContentChange={this.onHandleContentChange}
          onHandleRemoveVariantImage={this.onHandleRemoveVariantImage}
          onHandleChangeVariantName={this.onHandleChangeVariantName}
          onGetChatgptContent={this.onGetChatgptContent}
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
    content: state.wpsProduct.content,
    info: state.wpsProduct.info,
    isFetching: state.wpsProduct.isFetching,
    categories: state.wpsProduct.categories,
    current_category: state.wpsProduct.current_category,
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
    resetCategories,
    setHandleContentChange,
    removeVariantImage,
    changeVariantName,
    getChatgptContent
  }),
  // withAuthRedirect,
  withRouter
)(WpsProductContainer);
