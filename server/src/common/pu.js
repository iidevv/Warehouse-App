export const getPrice = (prices) => {
  return (
    prices.retail ||
    prices.originalRetail ||
    prices.originalBase + prices.originalBase * 0.35
  );
};

export const getInventory = (inventory) => {
  return inventory.locales.reduce(
    (total, local) => total + (local.quantity || 0),
    0
  );
};
