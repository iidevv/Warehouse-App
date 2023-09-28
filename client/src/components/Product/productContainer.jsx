import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Product from "./product";
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
  changeName,
  removeVariantImage,
  removeVariant,
  removeVariants,
  changeVariantName,
  getChatgptContent,
  findAndReplace,
  removeAdditionalImage,
  setProductCreateData,
  optimizeImages,
} from "../../redux/reducers/product-reducer";

class ProductContainer extends React.Component {
  componentDidMount() {
    const id = this.props.params.id;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const search = urlParams.get("search") || undefined;
    const vendor = urlParams.get("vendor") || undefined;
    const link = urlParams.get("link") || undefined;
    if (!id) id = 1;
    this.props.getProduct(vendor, id, search, link);
    if (search) {
      this.props.setProductCreateData("search", search);
    }
    this.props.setCategory(
      JSON.parse(localStorage.getItem("current_categories"))
    );
  }
  pushToCatalog = (data) => {
    data.page_title = this.props.content.page_title;
    data.search_keywords = this.props.content.search_keywords;
    data.meta_keywords = this.props.content.meta_keywords.split(", ");
    data.meta_description = this.props.content.meta_description;
    data.description = this.props.content.description;
    const categories = JSON.parse(
      localStorage.getItem("current_categories")
    ).flatMap((id) => +id.category_id);
    data.categories = categories;
    data.create_type = this.props.create_type;
    data.create_value = this.props.create_value;
    // remove duplicates
    data.images = data.images.filter((image, index, array) => {
      const firstIndex = array.findIndex(
        (item) => item.image_url === image.image_url
      );
      return firstIndex === index;
    });
    // remove variant_id
    data.images = data.images.map((image, i) => {
      delete image.variant_id;
      delete image.is_additional;
      if (i == 0) image.is_thumbnail = true;
      image.sort_order = i;
      return image;
    });
    this.props.createBigcommerceProduct(data);
  };
  onSearchCategories = (query) => {
    this.props.searchCategories(query);
  };
  onSetCategory = () => {
    this.props.setCategory(
      JSON.parse(localStorage.getItem("current_categories"))
    );
    this.props.resetCategories();
  };
  onHandleContentChange = (id, value) => {
    this.props.setHandleContentChange(id, value);
  };
  onHandleChangeName = (name) => {
    this.props.changeName(name);
  };
  onHandleRemoveVariant = (id, variant_id) => {
    this.props.removeVariant(id, variant_id);
  };
  onHandleRemoveVariants = (idsToRemove, variantIdsToRemove) => {
    this.props.removeVariants(idsToRemove, variantIdsToRemove);
  };
  onHandleRemoveVariantImage = (id, variant_id) => {
    this.props.removeVariantImage(id, variant_id);
  };
  onHandleChangeVariantName = (id, name) => {
    this.props.changeVariantName(id, name);
  };
  onGetChatgptContent = (title, description) => {
    this.props.getChatgptContent(title, description);
  };
  onFindAndReplace = (find, replace) => {
    this.props.findAndReplace(find, replace);
  };
  onHandleRemoveAdditionalImage = (url) => {
    this.props.removeAdditionalImage(url);
  };
  onSetProductCreateData = (type, value) => {
    this.props.setProductCreateData(type, value);
    console.log(type, value);
  };

  onHandleOptimizeImages = (product) => {
    this.props.optimizeImages(product);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <Product
          product={this.props.productData}
          content={this.props.content}
          pushToCatalog={this.pushToCatalog}
          onSearchCategories={this.onSearchCategories}
          onSetCategory={this.onSetCategory}
          onHandleChangeName={this.onHandleChangeName}
          onHandleContentChange={this.onHandleContentChange}
          onFindAndReplace={this.onFindAndReplace}
          onHandleRemoveVariant={this.onHandleRemoveVariant}
          onHandleRemoveVariants={this.onHandleRemoveVariants}
          onHandleRemoveVariantImage={this.onHandleRemoveVariantImage}
          onHandleChangeVariantName={this.onHandleChangeVariantName}
          onHandleRemoveAdditionalImage={this.onHandleRemoveAdditionalImage}
          onGetChatgptContent={this.onGetChatgptContent}
          onSetProductCreateData={this.onSetProductCreateData}
          onHandleOptimizeImages={this.onHandleOptimizeImages}
          categories={this.props.categories}
          current_categories={this.props.current_categories}
          create_type={this.props.create_type}
          create_value={this.props.create_value}
        />
      </>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    productData: state.product.productData,
    content: state.product.content,
    info: state.product.info,
    isFetching: state.product.isFetching,
    categories: state.product.categories,
    current_categories: state.product.current_categories,
    create_type: state.product.create_type,
    create_value: state.product.create_value,
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
    changeName,
    removeVariantImage,
    removeVariant,
    removeVariants,
    changeVariantName,
    getChatgptContent,
    findAndReplace,
    removeAdditionalImage,
    setProductCreateData,
    optimizeImages,
  }),
  withRouter
)(ProductContainer);
