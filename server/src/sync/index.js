export const updateProducts = async (vendor, status, query, limit) => {
  await beforeUpdateProducts(vendor);
  .find(query).skip(skip).limit(limit);
  const limit = 5;
  let currentPage = 1;
  let totalPages = 1;
  let productsToUpdate = 0;
  let productsUpdated = 0;
};
