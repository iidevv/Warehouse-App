import { updateStatusModel } from "../models/updateStatus.js";

export const syncCatalog = async () => {
  try {
    setSyncCatalogStatus(true, "1/1");
    // Simulate sync process
    setTimeout(async () => {
      setSyncCatalogStatus(false, "");
    }, 5000);
  } catch (error) {
    throw error;
  }
};

export const setSyncCatalogStatus = async (isUpdating, updateStatus) => {
  try {
    const doc = await updateStatusModel.findOneAndUpdate(
      {
        _id: "6881c6c07ec7e07ef1e760eb",
      },
      {
        is_updating: isUpdating,
        update_status: updateStatus,
      },
      { new: true }
    );
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};

export const getSyncCatalogStatus = async () => {
  try {
    const doc = await updateStatusModel.findOne({
      _id: "6881c6c07ec7e07ef1e760eb",
    });
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};
