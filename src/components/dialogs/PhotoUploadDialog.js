import React, { useState } from 'react';
import PropTypes from 'prop-types';
import apiRequest from '@/lib/apiRequest';

const PhotoUploadDialog = ({ recipeId, onClose, onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const result = await apiRequest(`recipes/${recipeId}/photo`, 'POST', formData);
      if (result.success) {
        onUploadSuccess(result.data);
      } else {
        onUploadError(result.message || 'An unknown error occurred');
      }
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error uploading photo: ${error.message}`;
      onUploadError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl mb-4">Upload Photo</h2>
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <div className="flex justify-end">
          <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Upload</button>
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

PhotoUploadDialog.propTypes = {
  recipeId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func,
  onUploadError: PropTypes.func,
};

export default PhotoUploadDialog;
