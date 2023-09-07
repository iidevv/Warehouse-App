import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import CategoryMapping from "./CategoryMapping";
import Preloader from "../common/preloader/Preloader";

import {
  getCategories,
  setCategories,
  setToggleIsFetching,
  updateCategory,
  searchDMGCategories,
} from "./../../redux/reducers/category-mapping-reducer";

class categoryMappingContainer extends React.Component {
  vendor = null;
  componentDidMount() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    this.vendor = urlParams.get("vendor");
    this.props.getCategories(this.vendor);
  }
  onPageChanged = (query, page) => {
    this.props.getCategories(this.vendor, query, page);
  };
  onFilterChanged = (query) => {
    console.log(query);
    this.props.getCategories(this.vendor, query);
  };
  onSearchDMGCategories = (query) => {
    this.props.searchDMGCategories(query);
  };
  onUpdateCategory = (data) => {
    this.props.updateCategory(this.vendor, data);
  };

  render() {
    return (
      <div className="container">
        {this.props.isFetching ? <Preloader /> : null}
        <CategoryMapping
          vendor={this.vendor}
          categories={this.props.categories}
          pagination={this.props.pagination}
          query={this.props.query}
          total={this.props.total}
          dmg_categories={this.props.dmg_categories}
          onUpdateCategory={this.onUpdateCategory}
          onSearchDMGCategories={this.onSearchDMGCategories}
          onPageChanged={this.onPageChanged}
          onFilterChanged={this.onFilterChanged}
        />
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    vendor: state.categoryMapping.vendor,
    categories: state.categoryMapping.categories,
    isFetching: state.categoryMapping.isFetching,
    total: state.categoryMapping.total,
    pagination: state.categoryMapping.pagination,
    query: state.categoryMapping.query,
    dmg_categories: state.categoryMapping.dmg_categories,
  };
};

export default compose(
  connect(mapStateToProps, {
    getCategories,
    setCategories,
    setToggleIsFetching,
    updateCategory,
    searchDMGCategories,
  })
)(categoryMappingContainer);
