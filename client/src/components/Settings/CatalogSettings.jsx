import React from "react";

const CatalogSettings = (props) => {
  const syncCatalog = () => {
    props.onSyncCatalog();
  };

  const syncStatus = props.sync_catalog_status.update_status
    ? `Syncing (${props.sync_catalog_status.update_status})`
    : "Syncing...";

  return (
    <div className="relative w-full px-4 py-6 bg-white shadow-lg mb-4">
      <h2 className="text-xl mb-2">Catalog Settings</h2>
      <button
        onClick={() => {
          syncCatalog();
        }}
        disabled={props.sync_catalog_status.is_updating}
        className="py-2 mb-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
      >
        {props.sync_catalog_status.is_updating ? `${syncStatus}` : "Sync catalog"}
      </button>
    </div>
  );
};

export default CatalogSettings;
