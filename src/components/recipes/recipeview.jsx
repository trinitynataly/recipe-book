import { Fragment } from "react";
import Layout from "@/components/layout/layout";
import Image from 'next/image';
import PhotoStub from '../../../public/photo-stub.jpg';

const RecipeView = ({ recipe }) => {

  if (!recipe) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </Layout>
    );
  }

  const { title, description, ingredients, instructions, cook_time, tags, type, author, created_at, updated_at, photo } = recipe;

  return (
    <Fragment>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-3">
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <div className="relative w-full h-64 mb-4">
                {photo ? (
                  <Image
                    src={`/uploads/${photo}`}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <Image
                    src={PhotoStub}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                  />
                )}
              </div>
              <p className="mb-4">{description}</p>
              <h2 className="text-2xl font-bold mb-2">Ingredients</h2>
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: ingredients }}></div>
              <h2 className="text-2xl font-bold mb-2">Instructions</h2>
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: instructions }}></div>
            </div>
            <div className="col-span-1">
              <h2 className="text-xl font-bold mb-2">Details</h2>
              <p><strong>Cook Time:</strong> {cook_time} minutes</p>
              <p><strong>Tags:</strong> {tags.join(', ')}</p>
              <p><strong>Type:</strong> {type}</p>
              <p><strong>Author:</strong> {author}</p>
              <p><strong>Created At:</strong> {new Date(created_at).toLocaleDateString()}</p>
              <p><strong>Updated At:</strong> {new Date(updated_at).toLocaleDateString()}</p>
              {/* Add buttons for editing and deleting if user is authorized */}
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export default RecipeView;
