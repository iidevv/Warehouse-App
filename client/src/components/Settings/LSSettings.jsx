import React, { useState } from "react";

const LSSettings = (props) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("name", "LS");
    formData.append("catalog", file);

    props.onUploadLSCatalog(formData);
  };

  return (
    <div className="relative w-full px-4 py-6 bg-white shadow-lg mb-4">
      <h2 className="text-xl mb-2">LS2 Settings</h2>
      <p className="text-lg mb-2">Upload catalog</p>

      <div className="flex flex-wrap gap-2">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          id="fileInput"
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="py-2 px-4 disabled:opacity-50 w-auto bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          Choose File
        </label>

        <button
          onClick={handleUpload}
          className="py-2 px-4 disabled:opacity-50 w-auto bg-green-600 hover:bg-green-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg"
        >
          Upload
        </button>
      </div>

      {file && (
        <p className="mt-2 text-sm text-gray-700">Selected file: {file.name}</p>
      )}
      {props.catalog_status && (
        <p className="mt-2 text-sm text-gray-700">{props.catalog_status}</p>
      )}
    </div>
  );
};

export default LSSettings;
