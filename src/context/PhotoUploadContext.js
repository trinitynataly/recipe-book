import { createContext, useContext, useState, useCallback } from 'react';
import PhotoUploadDialog from '@/components/dialogs/PhotoUploadDialog';

const PhotoUploadContext = createContext();

export const PhotoUploadProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeId, setRecipeId] = useState(null);
  const [onUploadSuccess, setOnUploadSuccess] = useState(null);
  const [onUploadError, setOnUploadError] = useState(null);

  const openUpload = useCallback((id, successCallback, errorCallback) => {
    setRecipeId(id);
    setOnUploadSuccess(() => successCallback);
    setOnUploadError(() => errorCallback);
    setIsOpen(true);
  }, []);

  const closeUpload = useCallback(() => {
    setIsOpen(false);
    setOnUploadSuccess(null);
    setOnUploadError(null);
    setRecipeId(null);
  }, []);

  return (
    <PhotoUploadContext.Provider value={{ isOpen, recipeId, openUpload, closeUpload, onUploadSuccess, onUploadError }}>
      {children}
      {isOpen && <PhotoUploadDialog recipeId={recipeId} onClose={closeUpload} onUploadSuccess={onUploadSuccess} onUploadError={onUploadError} />}
    </PhotoUploadContext.Provider>
  );
};

export const usePhotoUpload = () => {
  return useContext(PhotoUploadContext);
};
