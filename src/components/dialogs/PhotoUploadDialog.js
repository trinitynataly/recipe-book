/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A dialog component for uploading a photo to a recipe.
*/

// Import Fragment and useState hooks from React
import { Fragment, useState } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the apiRequest function from the lib folder
import apiRequest from '@/lib/apiRequest';

/**
 * PhotoUploadDialog component to upload a photo to a recipe.
 * PhotoUploadDialog component properties:
 * @param recipeId: the ID of the recipe to upload the photo to
 * @param onClose: the function to close the dialog
 * @param onUploadSuccess: the function to call on successful photo upload
 * @param onUploadError: the function to call on photo upload error
 * @returns a dialog for uploading a photo to a recipe
 */
const PhotoUploadDialog = ({ recipeId, onClose, onUploadSuccess, onUploadError }) => {
  // Define the file state to store the selected photo
  const [file, setFile] = useState(null);

  // Function to handle the file change event
  const handleFileChange = (e) => {
    // Set the selected file to the first file in the event target
    setFile(e.target.files[0]);
  };

  // Function to handle the photo upload
  const handleUpload = async () => {
    // Check if a file is selected
    if (!file) return;
    // Create a new FormData object to store the photo
    const formData = new FormData();
    // Append the photo to the FormData object
    formData.append('photo', file);

    // Attempt to upload the photo to the recipe
    try {
      // Send a POST request to the API with the recipe ID and photo data
      const result = await apiRequest(`recipes/${recipeId}/photo`, 'POST', formData);
      // Check if the upload was successful
      if (result.success) {
        // Call the onUploadSuccess function with the uploaded photo data
        onUploadSuccess(result.data);
      } else {
        // Call the onUploadError function with the error message
        onUploadError(result.message || 'An unknown error occurred');
      }
      // Close the dialog
      onClose();
    } catch (error) { // Catch any errors that occur during the upload
      // Get the error message from the response data or the error message
      const errorMessage = error.response?.data?.message || `Error uploading photo: ${error.message}`;
      // Call the onUploadError function with the error message
      onUploadError(errorMessage);
    }
  };

  // Return the photo upload dialog
  return (
    <Fragment>
      {/* Dialog overlay */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {/* Dialog content */}
        <div className="bg-white p-6 rounded shadow-lg w-96">
          {/* Dialog title */}
          <h2 className="text-xl mb-4">Upload Photo</h2>
          {/* File input for photo selection */}
          <input type="file" onChange={handleFileChange} className="mb-4" />
          {/* Upload and cancel buttons */}
          <div className="flex justify-end">
            <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Upload</button>
            <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Validate the function arguments
PhotoUploadDialog.propTypes = {
  recipeId: PropTypes.string.isRequired, // The ID of the recipe to upload the photo to
  onClose: PropTypes.func.isRequired, // The function to close the dialog
  onUploadSuccess: PropTypes.func, // The function to call on successful photo upload
  onUploadError: PropTypes.func, // The function to call on photo upload error
};

// Export the PhotoUploadDialog component
export default PhotoUploadDialog;
