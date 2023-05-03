import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PuProductPage from "./PuProductPage";
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
} from "../../redux/reducers/pu-product-reducer";

class PuProductContainer extends React.Component {
  componentDidMount() {
    const id = this.props.params.id;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const search = urlParams.get("search") || undefined;
    if (!id) id = 1;
    if (search) {
      this.props.getProduct(id, search);
      this.props.setProductCreateData("search", search);
    } else {
      this.props.getProduct(id);
    }
    this.props.setCategory(JSON.parse(localStorage.getItem("current_categories")));
  }
  pushToCatalog = (data) => {
    data.page_title = this.props.content.page_title;
    data.search_keywords = this.props.content.search_keywords;
    data.meta_keywords = this.props.content.meta_keywords.split(", ");
    data.meta_description = this.props.content.meta_description;
    data.description = this.props.content.description;
    const categories = JSON.parse(localStorage.getItem("current_categories")).flatMap(id => +id.category_id);
    console.log(categories);
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
    this.props.setCategory(JSON.parse(localStorage.getItem("current_categories")));
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
  onGetChatgptContent = (contentField, text) => {
    this.props.getChatgptContent(contentField, text);
  };
  onFindAndReplace = (find, replace) => {
    this.props.findAndReplace(find, replace);
  };
  onHandleRemoveAdditionalImage = (url) => {
    this.props.removeAdditionalImage(url);
  };
  onSetProductCreateData = (type, value) => {
    this.props.setProductCreateData(type, value);
  };

  render() {
    return (
      <>
        {this.props.isFetching ? <Preloader /> : null}
        <Notifications info={this.props.info} />
        <PuProductPage
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
    productData: state.puProduct.productData,
    content: state.puProduct.content,
    info: state.puProduct.info,
    isFetching: state.puProduct.isFetching,
    categories: state.puProduct.categories,
    current_categories: state.puProduct.current_categories,
    create_type: state.puProduct.create_type,
    create_value: state.puProduct.create_value,
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
  }),
  withRouter
)(PuProductContainer);
