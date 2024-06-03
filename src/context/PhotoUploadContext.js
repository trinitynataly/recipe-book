/*
Version: 1.2
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
A context provider for managing the photo upload dialog state.
*/

// Import the createContext, useContext, useState, and useCallback hooks from React
import { createContext, useContext, useState, useCallback } from 'react';
// Import the PhotoUploadDialog component
import PhotoUploadDialog from '@/components/dialogs/PhotoUploadDialog';

// Create a new context for the photo upload dialog
const PhotoUploadContext = createContext();

/**
 * PhotoUploadProvider component to manage the photo upload dialog state.
 * @param children - the child components
 * @returns {JSX.Element} - the provider component for managing the photo upload dialog state
 */
export const PhotoUploadProvider = ({ children }) => {
  // Define the state variables for the dialog
  const [isOpen, setIsOpen] = useState(false);
  // Define the state variables for the recipe ID and callbacks
  const [recipeId, setRecipeId] = useState(null);
  // Define the state variables for the success and error callbacks
  const [onUploadSuccess, setOnUploadSuccess] = useState(null);
  // Define the state variables for the error callback
  const [onUploadError, setOnUploadError] = useState(null);

  // Define the function to open the photo upload dialog
  const openUpload = useCallback((id, successCallback, errorCallback) => {
    setRecipeId(id); // Set the recipe ID
    setOnUploadSuccess(() => successCallback); // Set the success callback
    setOnUploadError(() => errorCallback); // Set the error callback
    setIsOpen(true); // Open the dialog
  }, []);

  // Define the function to close the photo upload dialog
  const closeUpload = useCallback(() => {
    setIsOpen(false); // Close the dialog
    setOnUploadSuccess(null); // Reset the success callback
    setOnUploadError(null); // Reset the error callback
    setRecipeId(null); // Reset the recipe ID
  }, []);

  // Return the provider component with the context value
  return (
    <PhotoUploadContext.Provider value={{ isOpen, recipeId, openUpload, closeUpload, onUploadSuccess, onUploadError }}>
      {/* Render the children components */}
      {children}
      {/* Render the photo upload dialog if open */}
      {isOpen && <PhotoUploadDialog recipeId={recipeId} onClose={closeUpload} onUploadSuccess={onUploadSuccess} onUploadError={onUploadError} />}
    </PhotoUploadContext.Provider>
  );
};

// Define a custom hook to use the photo upload context
export const usePhotoUpload = () => useContext(PhotoUploadContext);