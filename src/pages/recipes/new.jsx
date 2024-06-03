/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
New recipe page to create a new recipe
*/

// Import the Fragment from React
import {Fragment} from "react";
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the useRouter hook from Next.js for routing
import {useRouter} from 'next/router';
// Import the useSession hook from next-auth/react
import {useSession} from 'next-auth/react';
// Import the Layout component for the page layout
import Layout from "@/components/layout/layout";
// Import the RecipeForm component for creating a new recipe
import RecipeForm from "@/components/recipes/recipeform";
// Import the apiRequest function from the apiRequest library
import apiRequest from '@/lib/apiRequest';
// Import the useToast hook from the ToastContext
import {useToast} from "@/context/ToastContext";
// Import the slugify function from the utils library
import {slugify} from "@/lib/utils";
// Import the Error404 component for the 404 page
import Error404 from "@/pages/404";

/**
 * NewRecipePage component to create a new recipe.
 * @returns {JSX.Element}
 */
export default function NewRecipePage() {
  // Get the session object
  const {data: session, status} = useSession();
  // Check if the session is loading
  const loading = status === 'loading';
  // Get the user object
  const user = loading ? null : session?.user;
  // Get the router object
  const router = useRouter();
  // Get the showToast function from the ToastContext
  const {showToast} = useToast();
  // Check if the user is not logged in
  if (!loading && !user) {
  // Show the 404 page if the user is not logged in
    return <Error404/>;
  }
  // Handle the form submission
  const handleSubmit = async (formData) => {
    try {
      // Send the recipe data to the API
      const response = await apiRequest('recipes', 'POST', formData);
      // Check if the recipe was created successfully
      if (response.success) {
        // Redirect to the new recipe page
        router.push(`/recipes/${slugify(response.data.type)}/${response.data.slug}`);
        // Show a success message
        showToast('Success', 'Recipe created successfully', 'confirm');
      } else {
        // Show an error message
        showToast('Error', response.message, 'error');
      }
    // Catch any errors
    } catch (error) {
      // Show an error message
      showToast('Error', 'Failed to create recipe', 'error');
    }
  };

  // Return the new recipe form
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>New Recipe | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Create a new recipe"/>
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Recipe form */}
        <RecipeForm onSubmit={handleSubmit} submitButtonText="Create Recipe"/>
      </Layout>
    </Fragment>
  );
};
