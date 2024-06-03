/*
Version: 1.7
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
Edit recipe page to edit a recipe
*/

// Import the Fragment component from React
import {Fragment} from "react";
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the useSession hook from NextAuth
import {useSession} from 'next-auth/react';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the useRouter hook from Next.js for routing
import {useRouter} from 'next/router';
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";
// Import the RecipeForm component for creating a new recipe
import RecipeForm from "@/components/recipes/recipeform";
// Import the useToast hook from the ToastContext
import {useToast} from "@/context/ToastContext";
// Import the slugify function from the utils library
import {slugify} from "@/lib/utils";
// Import the apiRequest function from the apiRequest library
import apiRequest from '@/lib/apiRequest';
// Import the Error404 component for the 404 page
import Error404 from "@/pages/404";

/**
 * EditRecipePage component to edit a recipe.
 * @param {object} recipe - the recipe object
 * @returns {JSX.Element}
 */
const EditRecipePage = ({recipe}) => {
  // Get the router object
  const router = useRouter();
  // Get the showToast function from the ToastContext
  const {showToast} = useToast();
  // Get the session object
  const {data: session, status} = useSession();
  // Check if the session is loading
  const loading = status === 'loading';
  // Get the user object
  const user = loading ? null : session?.user;
  // Check if the user is not logged in
  const isAuthorOrAdmin = user && (user.isAdmin || user.id === recipe.authorID);
  // Show the 404 page if the user is not the author or an admin
  if (!isAuthorOrAdmin) {
    return <Error404/>;
  }
  // Handle the form submission
  const handleSubmit = async (formData) => {
    try {
      // Send the recipe data to the API
      const response = await apiRequest(`recipes/${recipe._id}`, 'PUT', formData);
      // Check if the recipe was updated successfully
      if (response.success) {
        // Redirect to the updated recipe page
        router.push(`/recipes/${slugify(response.data.type)}/${response.data.slug}`);
        // Show a success message
        showToast('Success', 'Recipe updated successfully', 'confirm');
      } else {
        // Show an error message
        showToast('Error', response.message, 'error');
      }
    // Catch any errors
    } catch (error) {
      // Show an error message
      showToast('Error', 'Failed to update recipe', 'error');
    }
  };

  // Generate the recipe title
  const RecipeTitle = `Edit ${recipe.title}`;

  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>{RecipeTitle} | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content={RecipeTitle}/>
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Recipe form */}
        <RecipeForm onSubmit={handleSubmit} initialData={recipe} submitButtonText="Edit Recipe"/>
      </Layout>
    </Fragment>
  );
}

// Validate the props passed to the EditRecipePage component
EditRecipePage.propTypes = {
  recipe: PropTypes.object.isRequired, // Recipe object
};

// Server-side function to fetch the recipe data by slug
export const getServerSideProps = async (context) => {
  // Get the category slug and recipe slug from the URL parameters
  const {categoryslug, recipeslug} = context.query;

  // Return a 404 error if the recipe slug is not found
  if (!recipeslug) {
    return {
      notFound: true,
    };
  }

  // Fetch the recipe data by slug from the API
  try {
    const response = await apiRequest(`recipes/${recipeslug}`, 'GET', null, context);

    // If the response is successful, return the recipe data
    if (response && response.success) {
      // Generate the recipe category slug
      const recipeCategorySlug = slugify(response.data.type);
      // Redirect to the correct URL if the category slug does not match
      if (recipeCategorySlug !== categoryslug) {
        return {
          redirect: {
            destination: `/recipes/${recipeCategorySlug}/${recipeslug}/edit`,
            permanent: true,
          },
        };
      } else {
        // Return the recipe data as props
        return {
          props: {
            recipe: response.data,
          },
        };
      }
    } else {
      // Return a 404 error if the recipe data is not found
      return {
        notFound: true,
      };
    }
  } catch (error) {
    // Return a 404 error if there is an issue fetching the recipe data
    return {
      notFound: true,
    };
  }
};

// Export the EditRecipePage component
export default EditRecipePage;
