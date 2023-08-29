const beforeUpdateProducts = async (vendor) => {
  if (vendor == "HH" || vendor == "LS") {
    await downloadInventoryFile(vendor);
  }
};
