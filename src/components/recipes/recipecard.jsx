import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/context/ToastContext';
import { usePhotoUpload } from '@/context/PhotoUploadContext';
import apiRequest from '@/lib/apiRequest';
import CameraIcon from '../../../public/icons/camera.svg';
import PencilIcon from '../../../public/icons/pencil.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import HeartFullIcon from '../../../public/icons/heart-full.svg';
import PhotoStub from '../../../public/photo-stub.jpg';

const RecipeCard = ({ recipe }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = loading ? null : session?.user;
  const { showToast } = useToast(); // Get the showToast function from ToastContext
  const { openUpload } = usePhotoUpload(); // Get the openUpload function from PhotoUploadContext
  const isAuthorOrAdmin = user && (user.isAdmin || user.id === recipe.authorID);
  const [isFavourite, setIsFavourite] = useState(recipe.favorite); // Assume recipe has an `isFavourite` property
  const [photo, setPhoto] = useState(recipe.photo); // Assume recipe has a `photo` property

  const onUploadSuccess = (updatedRecipe) => {
    setPhoto(updatedRecipe.photo);
    showToast('Success', 'Photo uploaded successfully', 'confirm');
  };

  const onUploadError = (error) => {
    showToast('Upload Error', error, 'error');
  };

  const handlePhotoUpload = () => {
    openUpload(recipe._id, onUploadSuccess, onUploadError); // Pass the recipe ID
  };

  const handleToggleFavorite = async () => {
    if (!user) return; // User must be logged in to toggle favorite

    try {
      const { success, favorite } = await apiRequest(`recipes/${recipe._id}/favorite`, 'POST');
      if (!success) {
        showToast('Error', 'Failed to toggle favorite status', 'error');
        return;
      } else {
        if (favorite) {
          showToast('Success', 'Added to favorites', 'confirm');
          setIsFavourite(true);
        } else {
          showToast('Success', 'Removed from favorites', 'confirm');
          setIsFavourite(false);
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite status:', error);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative">
      <Link href={`/recipes/${recipe._id}`} className="block w-full h-48 relative">
        {photo ? (
          <Image
            src={`/uploads/${photo}`}
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <Image
            src={PhotoStub}
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        )}
      </Link>
      <div className="absolute top-2 right-2 flex space-x-2">
        {isAuthorOrAdmin && (
          <button className="bg-white p-2 rounded-full shadow-md" onClick={handlePhotoUpload}>
            <CameraIcon className="w-6 h-6 text-gray-600" />
          </button>
        )}
        {isAuthorOrAdmin && (
          <Link href={`/recipes/${recipe._id}/edit`} className="bg-white p-2 rounded-full shadow-md">
            <PencilIcon className="w-6 h-6 text-gray-600" />
          </Link>
        )}
        {user && (
          <button className="bg-white p-2 rounded-full shadow-md" onClick={handleToggleFavorite}>
            {isFavourite ? (
              <HeartFullIcon className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-red-500" />
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">
          <Link href={`/recipes/${recipe._id}`}>{recipe.title}</Link>
        </h2>
        <p className="text-gray-700">{recipe.description}</p>
        <p className="text-gray-600 mt-2">Type: {recipe.type}</p>
        <Link href={`/recipes/${recipe._id}`} className="mt-4 bg-gray-200 hover:bg-tertiary text-gray-600 hover:text-white px-4 py-2 rounded inline-block">
          Start To Cook
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
