import { Fragment, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useToast } from '@/context/ToastContext';
import { usePhotoUpload } from '@/context/PhotoUploadContext';
import { slugify, humanReadableTime } from '@/lib/utils';
import apiRequest from '@/lib/apiRequest';
import PhotoStub from '../../../public/photo-stub.jpg';
import CameraIcon from '../../../public/icons/camera.svg';
import PencilIcon from '../../../public/icons/pencil.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import HeartFullIcon from '../../../public/icons/heart-full.svg';

const RecipeView = ({ recipe }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = loading ? null : session?.user;
  const [isFavourite, setIsFavourite] = useState(recipe?.favorite || false);
  const [photo, setPhoto] = useState(recipe?.photo || null);
  const { showToast } = useToast();
  const { openUpload } = usePhotoUpload();
  const recipeUrl = `/recipes/${slugify(recipe.type)}/${recipe.slug}`;
  const STORAGE_METHOD = process.env.NEXT_PUBLIC_STORAGE_METHOD;
  const s3BucketUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL; 

  const getPhotoUrl = () => {
    if (!photo) {
      return PhotoStub;
    }
    if (STORAGE_METHOD === 's3') {
      return `${s3BucketUrl}/public/${photo}`;
    }
    return `/uploads/${photo}`;
  };

  const onUploadSuccess = (updatedRecipe) => {
    setPhoto(updatedRecipe.photo);
    showToast('Success', 'Photo uploaded successfully', 'confirm');
  };

  const onUploadError = (error) => {
    showToast('Upload Error', error, 'error');
  };

  const handlePhotoUpload = () => {
    openUpload(recipe._id, onUploadSuccess, onUploadError);
  };

  const handleToggleFavorite = async () => {
    if (!user) return;

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

  const handleDeleteRecipe = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const { success } = await apiRequest(`recipes/${recipe._id}`, 'DELETE');
      if (success) {
        showToast('Success', 'Recipe deleted successfully', 'confirm');
        window.location.href = '/';
      } else {
        showToast('Error', 'Failed to delete recipe', 'error');
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      showToast('Error', 'Failed to delete recipe', 'error');
    }
  };

  if (!recipe) {
    return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
    );
  }

  const { title, description, ingredients, instructions, cook_time, type, author, createdAt, updatedAt, slug } = recipe;
  const tags = recipe?.tags ? recipe.tags.map(tag => tag.name).join(', #') : '';
  const isAuthorOrAdmin = user && (user.isAdmin || user.id === recipe.authorID);
  
  return (
      <Fragment>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-0">{title}</h1>
          <div className="text-lg mb-4">
            <Link href="/">Recipe Book</Link> / <Link href={`/recipes/${slugify(type)}`}>{type}</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="relative w-full h-96 mb-4 border rounded-lg shadow-lg overflow-hidden">
                <Image
                    src={getPhotoUrl()}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  {isAuthorOrAdmin && (
                      <button className="bg-white p-2 rounded-full shadow-md" onClick={handlePhotoUpload}>
                        <CameraIcon className="w-6 h-6 text-gray-600"/>
                      </button>
                  )}
                  {isAuthorOrAdmin && (
                      <Link href={`${recipeUrl}/edit`} className="bg-white p-2 rounded-full shadow-md">
                        <PencilIcon className="w-6 h-6 text-gray-600"/>
                      </Link>
                  )}
                  {user && (
                      <button className="bg-white p-2 rounded-full shadow-md" onClick={handleToggleFavorite}>
                        {isFavourite ? (
                            <HeartFullIcon className="w-6 h-6 text-red-500"/>
                        ) : (
                            <HeartIcon className="w-6 h-6 text-red-500"/>
                        )}
                      </button>
                  )}
                </div>
              </div>
              <p className="mb-4">{description}</p>
              <hr className="my-4"></hr>
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{__html: ingredients}}></div>
              <hr className="my-4"></hr>
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <div className="mb-4 prose max-w-none" dangerouslySetInnerHTML={{__html: instructions}}></div>
            </div>
            <div className="lg:col-span-1">
              <p><strong>Cook Time:</strong> {humanReadableTime(cook_time)}</p>
              <p><strong>Type:</strong> <Link href={`/recipes/${slugify(type)}`}>{type}</Link></p>
              {tags && <p><strong>Tags:</strong> #{tags}</p>}
              <p><strong>Author:</strong> {author.name}</p>
              <p><strong>Created At:</strong> {format(new Date(createdAt), 'MM/dd/yyyy')}</p>
              <p><strong>Updated At:</strong> {format(new Date(updatedAt), 'MM/dd/yyyy')}</p>
              {isAuthorOrAdmin && (
                  <Fragment>
                    <hr style={{margin: "1em 0"}}></hr>
                    <div className="mt-4">
                      <ul className="space-y-2">
                        <li>
                          <Link href={`${recipeUrl}/edit`} className="text-primary  hover:text-tertiary">Edit
                            Recipe
                          </Link>
                        </li>
                        <li>
                          <button className="text-primary hover:text-tertiary" onClick={handlePhotoUpload}>Upload New
                            Photo
                          </button>
                        </li>
                        <li>
                          <button className="text-white bg-tertiary px-4 py-1 rounded-md hover:bg-primary"
                                  onClick={handleDeleteRecipe}>Delete Recipe
                          </button>
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

export default RecipeView;
