/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 06/06/2024
A recipe card component for displaying recipe details.
*/

// Import the Fragment component and useState, useEffect hooks from React
import { Fragment, useState, useEffect } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Image component from Next.js for image optimization
import Image from 'next/image';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the useSession hook from NextAuth for session management
import { useSession } from 'next-auth/react';
// Import the useToast hook from the ToastContext for displaying notifications
import { useToast } from '@/context/ToastContext';
// Import the usePhotoUpload hook from the PhotoUploadContext for photo upload
import { usePhotoUpload } from '@/context/PhotoUploadContext';
// Import the slugify function from the utils library for URL generation
import { slugify } from '@/lib/utils';
// Import the apiRequest function from the apiRequest library for API calls
import apiRequest from '@/lib/apiRequest';
// Import the CameraIcon, PencilIcon, HeartIcon, and HeartFullIcon from the icons library
import CameraIcon from '../../../public/icons/camera.svg';
import PencilIcon from '../../../public/icons/pencil.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import HeartFullIcon from '../../../public/icons/heart-full.svg';
import PhotoStub from '../../../public/photo-stub.jpg';

/**
 * RecipeCard component to display the recipe details with photo, title, description, and type.
 * RecipeCard component properties:
 * @param {object} recipe - the recipe object with photo, title, description, and type
 * @returns {JSX.Element} - the recipe card with photo, title, description, and type
 */
const RecipeCard = ({ recipe }) => {
  // Get the session object for user authentication
  const { data: session, status } = useSession();
  // Define the loading state based on the session status
  const loading = status === 'loading';
  // Get the user object based on the session status
  const user = loading ? null : session?.user;
  // Get the showToast function from ToastContext
  const { showToast } = useToast();
  // Get the openUpload function from PhotoUploadContext
  const { openUpload } = usePhotoUpload();
  // Check if the user is the author or admin
  const isAuthorOrAdmin = user && (user.isAdmin || user.id === recipe.authorID);
  // Define the state for the favorite status
  const [isFavourite, setIsFavourite] = useState(recipe.favorite);
  // Define the state for the photo URL
  const [photo, setPhoto] = useState(recipe.photo);
  // Generate the recipe URL based on the type and slug
  const recipeUrl = `/recipes/${slugify(recipe.type)}/${recipe.slug}`;
  // Get the storage method and S3 bucket URL from environment variables
  const STORAGE_METHOD = process.env.NEXT_PUBLIC_STORAGE_METHOD;
  // Define the S3 bucket URL for photo storage from environment variables
  const s3BucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL; 

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Update the favorite status when the recipe changes
  useEffect(() => {
    // Update the favorite status based on the recipe object
    setIsFavourite(recipe.favorite);
  }, [recipe.favorite]); // Update the favorite status on recipe change

  // Function to get the photo URL based on the storage method
  const getPhotoUrl = () => {
    // Check if the photo exists
    if (!photo) {
      // Return the photo stub image if the photo is missing
      return PhotoStub;
    }
    // Check if the storage method is S3
    if (STORAGE_METHOD === 's3') {
      // Return the S3 bucket URL with the photo path
      return `${s3BucketUrl}/public/${photo}`;
    }
    // Return the local photo path if the storage method is local
    return `/uploads/${photo}`;
  };

  // Function to handle the photo upload success
  const onUploadSuccess = (updatedRecipe) => {
    // Update the photo and show the success notification
    setPhoto(updatedRecipe.photo);
    // Show the success notification for photo upload
    showToast('Success', 'Photo uploaded successfully', 'confirm');
  };

  // Function to handle the photo upload error
  const onUploadError = (error) => {
    // Show the error notification for photo upload
    showToast('Upload Error', error, 'error');
  };

  // Function to handle the photo upload
  const handlePhotoUpload = () => {
    // Open the photo upload modal with the recipe ID, success, and error callbacks
    openUpload(recipe._id, onUploadSuccess, onUploadError);
  };

  // Function to handle the toggle favorite status
  const handleToggleFavorite = async () => {
    if (!user) return; // User must be logged in to toggle favorite

    // Toggle the favorite status for the recipe
    try {
      // Send a POST request to the API to toggle the favorite status
      const { success, favorite } = await apiRequest(`recipes/${recipe._id}/favorite`, 'POST');
      if (!success) { // Show error notification if the request fails
        showToast('Error', 'Failed to toggle favorite status', 'error');
        return;
      } else { // Show success notification and update the favorite status
        if (favorite) { // If the recipe is added to favorites
          // Show the success notification for adding to favorites
          showToast('Success', 'Added to favorites', 'confirm');
          // Update the favorite status to true
          setIsFavourite(true);
        } else {
          // Show the success notification for removing from favorites
          showToast('Success', 'Removed from favorites', 'confirm');
          // Update the favorite status to false
          setIsFavourite(false);
        }
      }
    } catch (error) { // Show error notification if the request fails
      console.error('Failed to toggle favorite status:', error);
    }
  };

  // Return the recipe card with photo, title, description, and type
  return (
    <Fragment>
      {/* Recipe card with photo, title, description, and type */}
      <div className="border dark:border-gray-300 rounded-lg overflow-hidden shadow-lg relative">
        {/* Recipe photo with Link */}
        <Link href={recipeUrl} className="block relative w-full h-48 overflow-hidden">
          <div className="flex items-center justify-center h-full">
          {!imageLoaded && (
            <div className="skeleton-loader absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              {/* Placeholder content */}
            </div>
          )}
            <Image
              src={getPhotoUrl()}
              alt={recipe.title}
              layout="responsive"
              width={640}
              height={360}
              objectFit="cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              quality={75}
              onLoad={handleImageLoad}
              priority={true}
            />
          </div>
        </Link>
        {/* Action buttons for photo upload, edit, and favorite */}
        <div className="absolute top-2 right-2 flex space-x-2">
          {/* Check if the user is the author or admin */}
          {isAuthorOrAdmin && (
            <Fragment>
              {/* Upload new photo button */}
              <button className="bg-white p-2 rounded-full shadow-md" onClick={handlePhotoUpload}>
                <CameraIcon className="w-6 h-6 text-gray-600" />
              </button>
              {/* Edit recipe button */}
              <Link href={`${recipeUrl}/edit`} className="bg-white p-2 rounded-full shadow-md">
                <PencilIcon className="w-6 h-6 text-gray-600" />
              </Link>
            </Fragment>
          )}
          {/* Favorite button for authenticated users */}
          {user && (
            <button className="bg-white p-2 rounded-full shadow-md" onClick={handleToggleFavorite}>
              {isFavourite ? ( // Show full heart icon if the recipe is a favorite
                <HeartFullIcon className="w-6 h-6 text-red-500" />
              ) : ( // Show empty heart icon if the recipe is not a favorite
                <HeartIcon className="w-6 h-6 text-red-500" />
              )}
            </button>
          )}
        </div>
        {/* Recipe details block */}
        <div className="p-4">
          {/* Recipe title with Link */}
          <h2 className="text-xl font-bold mb-2">
            <Link href={recipeUrl}>{recipe.title}</Link>
          </h2>
          {/* Recipe description */}
          <p className="text-gray-700">{recipe.description}</p>
          {/* Recipe type */}
          <p className="text-gray-600 mt-2">Type: {recipe.type}</p>
          {/* Start cooking button with Link */}
          <Link href={recipeUrl} className="mt-4 bg-gray-200 hover:bg-tertiary text-gray-600 hover:text-white px-4 py-2 rounded inline-block">
            Start To Cook
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

// Validate the RecipeCard component properties
RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired, // Recipe object with photo, title, description, and type
};

// Export the RecipeCard component
export default RecipeCard;
