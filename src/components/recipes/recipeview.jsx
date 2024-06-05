/*
Version: 1.9
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A recipe view component for displaying a single recipe with title, description, ingredients, instructions, cook time, type, author, and tags.
*/

// Import the Fragment component and useState hook from React
import { Fragment, useState } from "react";
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Image component from Next.js for image optimization
import Image from 'next/image';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the format function from date-fns for date formatting
import { format } from 'date-fns';
// Import the useSession hook from NextAuth for session management
import { useSession } from 'next-auth/react';
// Import the useToast hook from the ToastContext for displaying notifications
import { useToast } from '@/context/ToastContext';
// Import the usePhotoUpload hook from the PhotoUploadContext for photo upload
import { usePhotoUpload } from '@/context/PhotoUploadContext';
// Import the Image component from Next.js for image optimization
import { useRouter } from 'next/router';
// Import the slugify and humanReadableTime functions from the utils library for URL generation and time formatting
import { slugify, humanReadableTime } from '@/lib/utils';
// Import the apiRequest function from the apiRequest library for API calls
import apiRequest from '@/lib/apiRequest';
// Import the PhotoStub, CameraIcon, PencilIcon, HeartIcon, and HeartFullIcon from the icons library
import PhotoStub from '../../../public/photo-stub.jpg';
import CameraIcon from '../../../public/icons/camera.svg';
import PencilIcon from '../../../public/icons/pencil.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import HeartFullIcon from '../../../public/icons/heart-full.svg';

/**
 * RecipeView component to display a single recipe with title, description, ingredients, instructions, cook time, type, author, and tags.
 * RecipeView component properties:
 * @param {object} recipe - the recipe object with title, description, ingredients, instructions, cook time, type, author, and tags
 * @returns {JSX.Element} - the recipe view with title, description, ingredients, instructions, cook time, type, author, and tags
 */
const RecipeView = ({ recipe }) => {
  // Get the session object for user authentication
  const { data: session, status } = useSession();
  // Define the loading state based on the session status
  const loading = status === 'loading';
  // Get the user object based on the session status
  const user = loading ? null : session?.user;
  // Define the state for the favorite status
  const [isFavourite, setIsFavourite] = useState(recipe?.favorite || false);
  // Define the state for the photo URL
  const [photo, setPhoto] = useState(recipe?.photo || null);
  // Get the showToast function from ToastContext
  const { showToast } = useToast();
  // Get the openUpload function from PhotoUploadContext
  const { openUpload } = usePhotoUpload();
  // Get the router object for routing
  const router = useRouter();
  // Generate the recipe URL based on the type and slug
  const recipeUrl = `/recipes/${slugify(recipe.type)}/${recipe.slug}`;
  // Get the storage method and S3 bucket URL from environment variables
  const STORAGE_METHOD = process.env.NEXT_PUBLIC_STORAGE_METHOD;
  const s3BucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL; 

  // Function to get the photo URL based on the storage method
  const getPhotoUrl = () => {
    // Check if the photo is not available
    if (!photo) {
      // Return the photo stub image
      return PhotoStub;
    }
    // Check the storage method for the photo URL
    if (STORAGE_METHOD === 's3') {
      // Return the S3 bucket URL with the photo path
      return `${s3BucketUrl}/public/${photo}`;
    }
    // Return the local photo URL if the storage method is local
    return `/uploads/${photo}`;
  };

  // Function to handle the photo upload success
  const onUploadSuccess = (updatedRecipe) => {
    // Update the photo and show a success notification
    setPhoto(updatedRecipe.photo);
    // Show a success notification for the photo upload
    showToast('Success', 'Photo uploaded successfully', 'confirm');
  };

  // Function to handle the photo upload error
  const onUploadError = (error) => {
    // Show an error notification for the photo upload
    showToast('Upload Error', error, 'error');
  };

  // Function to handle the photo upload
  const handlePhotoUpload = () => {
    // Open the photo upload dialog with the recipe ID
    openUpload(recipe._id, onUploadSuccess, onUploadError);
  };

  // Function to handle the favorite status toggle
  const handleToggleFavorite = async () => {
    // Check if the user is not available and stop the function if not
    if (!user) return;

    // Make an API request to toggle the favorite status
    try {
      // Send a POST request to the server API to toggle the favorite status
      const { success, favorite } = await apiRequest(`recipes/${recipe._id}/favorite`, 'POST');
      // Check if the request was not successful
      if (!success) {
        // Show an error notification for the failed request
        showToast('Error', 'Failed to toggle favorite status', 'error');
      } else {
        // Show a success notification for the favorite status change
        if (favorite) { // Check if the recipe is added or removed from favorites
          // Show a confirmation notification for adding to favorites
          showToast('Success', 'Added to favorites', 'confirm');
          // Update the favorite status to true
          setIsFavourite(true);
        } else {
          // Show a confirmation notification for removing from favorites
          showToast('Success', 'Removed from favorites', 'confirm');
          // Update the favorite status to false
          setIsFavourite(false);
        }
      }
    } catch (error) { // Show an error notification for the failed request
      // Show an error notification for the failed request
      showToast('Error', 'Failed to toggle favorite status', 'error');
    }
  };

  // Function to handle the recipe deletion
  const handleDeleteRecipe = async () => {
    // Confirm the user choice to recipe deletion with a confirmation dialog
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    // Make an API request to delete the recipe
    try {
      // Send a DELETE request to the server API to delete the recipe
      const { success } = await apiRequest(`recipes/${recipe._id}`, 'DELETE');
      // Check if the recipe was deleted successfully
      if (success) {
        // Show a success notification for the recipe deletion
        showToast('Success', 'Recipe deleted successfully', 'confirm');
        // Redirect the user to the home page after the recipe deletion
        await router.push('/');
      } else {
        // Show an error notification for the failed recipe deletion
        showToast('Error', 'Failed to delete recipe', 'error');
      }
    } catch (error) { // Catch any errors that occur during the recipe deletion
      // Show an error notification for the failed request
      showToast('Error', 'Failed to delete recipe', 'error');
    }
  };

  // Destructure the recipe object properties
  const { title, description, ingredients, instructions, cook_time, type, author, createdAt, updatedAt } = recipe;
  // Get the human-readable tags from the recipe object
  const tags = recipe?.tags ? recipe.tags.map(tag => tag.name).join(', #') : '';
  // Check if the user is the author or an admin
  const isAuthorOrAdmin = user && (user.isAdmin || user.id === recipe.authorID);

  // Return the recipe view with title, description, ingredients, instructions, cook time, type, author, and tags
  return (
      <Fragment>
        {/* Recipe view with title, description, ingredients, instructions, cook time, type, author, and tags */}
        <div className="container mx-auto px-4 py-8">
          {/* Recipe title */}
          <h1 className="text-3xl font-bold mb-0">{title}</h1>
          {/* Breadcrumbs for the recipe */}
          <div className="text-lg mb-4">
            <Link href="/">Recipe Book</Link> / <Link href={`/recipes/${slugify(type)}`}>{type}</Link>
          </div>
          {/* Recipe main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left column */}
            <div className="lg:col-span-3">
              {/* Recipe photo or a stub photo */}
              <div className="relative w-full h-96 mb-4 border rounded-lg shadow-lg overflow-hidden">
                <Image
                    src={getPhotoUrl()}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    priority={false}
                    quality={75}
                />
                {/* Action buttons for photo upload, edit, and favorite */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  {/* Check if the user is the author or admin */}
                  {isAuthorOrAdmin && (
                      <Fragment>
                        {/* Upload new photo button */}
                        <button className="bg-white p-2 rounded-full shadow-md" onClick={handlePhotoUpload}>
                          <CameraIcon className="w-6 h-6 text-gray-600"/>
                        </button>
                        {/* Edit recipe button */}
                        <Link href={`${recipeUrl}/edit`} className="bg-white p-2 rounded-full shadow-md">
                          <PencilIcon className="w-6 h-6 text-gray-600"/>
                        </Link>
                      </Fragment>
                  )}
                  {/* Display favorite button for authenticated users only */}
                  {user && (
                      <button className="bg-white p-2 rounded-full shadow-md" onClick={handleToggleFavorite}>
                        {/* Check if the recipe is a favorite */}
                        {isFavourite ? (
                            // Show full heart icon if the recipe is a favorite
                            <HeartFullIcon className="w-6 h-6 text-red-500"/>
                        ) : (
                            // Show empty heart icon if the recipe is not a favorite
                            <HeartIcon className="w-6 h-6 text-red-500"/>
                        )}
                      </button>
                  )}
                </div>
              </div>
              {/* Show recipe description */}
              <p className="mb-4">{description}</p>
              <hr className="my-4"></hr>
              {/* Show recipe ingredients title */}
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              {/* Show the ingredients with the prose class to preserve formatting */}
              <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{__html: ingredients}}></div>
              <hr className="my-4"></hr>
              {/* Show recipe instructions title */}
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              {/* Show the instructions with the prose class to preserve formatting */}
              <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{__html: instructions}}></div>
            </div>
            {/* Right column */}
            <div className="lg:col-span-1">
              {/* Show recipe cook time in human-readable format */}
              <p><strong>Cook Time:</strong> {humanReadableTime(cook_time)}</p>
              {/* Show recipe category with the link */}
              <p><strong>Type:</strong> <Link href={`/recipes/${slugify(type)}`}>{type}</Link></p>
              {/* Show recipe tags */}
              {tags && <p><strong>Tags:</strong> #{tags}</p>}
              {/* Show recipe author */}
              <p><strong>Author:</strong> {author.name}</p>
              {/* Show recipe creation date in human-readable format */}
              <p><strong>Created At:</strong> {format(new Date(createdAt), 'MM/dd/yyyy')}</p>
              {/* Show recipe update date in human-readable format */}
              <p><strong>Updated At:</strong> {format(new Date(updatedAt), 'MM/dd/yyyy')}</p>
              {/* Show action buttons if user is the author or admin */}
              {isAuthorOrAdmin && (
                  <Fragment>
                    <hr style={{margin: "1em 0"}}></hr>
                    <div className="mt-4">
                      <ul className="space-y-2">
                        {/* Show edit recipe button */}
                        <li>
                          <Link href={`${recipeUrl}/edit`} className="text-primary  hover:text-tertiary">Edit Recipe</Link>
                        </li>
                        {/* Show upload new photo button */}
                        <li>
                          <button className="text-primary hover:text-tertiary" onClick={handlePhotoUpload}>Upload New Photo</button>
                        </li>
                        {/* Show delete recipe button */}
                        <li>
                          <button className="text-white bg-tertiary px-4 py-1 rounded-md hover:bg-primary" onClick={handleDeleteRecipe}>Delete Recipe </button>
                        </li>
                      </ul>
                    </div>
                  </Fragment>
              )}
            </div>
          </div>
        </div>
      </Fragment>
  );
};

// Validate the RecipeView component properties
RecipeView.propTypes = {
  recipe: PropTypes.object.isRequired, // Recipe object with title, description, ingredients, instructions, cook time, type, author, and tags
};

// Export the RecipeView component
export default RecipeView;
