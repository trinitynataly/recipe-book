import Image from 'next/image';
import { useState } from 'react';
import CameraIcon from '../../../public/icons/camera.svg';
import PencilIcon from '../../../public/icons/pencil.svg';
import HeartIcon from '../../../public/icons/heart.svg';
import HeartFullIcon from '../../../public/icons/heart-full.svg';

const RecipeCard = ({ recipe }) => {
  const isAuthorOrAdmin = true;
  const [isFavourite, setIsFavourite] = useState(true); // Assume recipe has an `isFavourite` property

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg relative">
      <div className="w-full h-48 relative">
        <Image
          src={`/api/recipes/${recipe._id}/photo`}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          {isAuthorOrAdmin && (
            <button className="bg-white p-2 rounded-full shadow-md">
              <CameraIcon className="w-6 h-6 text-gray-600" />
            </button>
          )}
          {isAuthorOrAdmin && (
            <button className="bg-white p-2 rounded-full shadow-md">
              <PencilIcon className="w-6 h-6 text-gray-600" />
            </button>
          )}
          <button className="bg-white p-2 rounded-full shadow-md">
            {isFavourite ? (
              <HeartFullIcon className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-red-500" />
            )}
          </button>
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
        <p className="text-gray-700">{recipe.description}</p>
        <p className="text-gray-600 mt-2">Type: {recipe.type}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Start To Cook
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
