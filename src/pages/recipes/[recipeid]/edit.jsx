import { Fragment } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from "@/components/layout/layout";
import RecipeForm from "@/components/recipes/recipeform";
import { useToast } from "@/context/ToastContext";
import apiRequest from '@/lib/apiRequest';
import Error404 from "@/pages/404";


const EditRecipePage = ({ recipe, error }) => {
    const router = useRouter();
    const { showToast } = useToast();
    if (error) {
        return <Error404 />;
      }
    const handleSubmit = async (formData) => {
        try {
            const response = await apiRequest(`recipes/${recipe._id}`, 'PUT', formData);
            if (response.success) {
                router.push(`/recipes/${response.data._id}`);
                showToast('Success', 'Recipe updated successfully', 'confirm');
            } else {
                showToast('Error', response.message, 'error');
            }
        } catch (error) {
            showToast('Error', 'Failed to update recipe', 'error');
        }
    };

    const RecipeTitle = `Edit ${recipe.title}`;

    return (
        <Fragment>
            <Head>
                <title>{RecipeTitle} | Recipe Book</title>
                <meta name="description" content={RecipeTitle} />
            </Head>
            <Layout>
                <RecipeForm onSubmit={handleSubmit} initialData={recipe} submitButtonText="Edit Recipe" />
            </Layout>
        </Fragment>
    );
}

export const getServerSideProps = async (context) => {
    const { recipeid } = context.query;
  
    if (!recipeid) {
      return {
        props: {
          recipe: null,
          error: true,
        },
      };
    }
  
    try {
      const response = await apiRequest(`recipes/${recipeid}`, 'GET', null, context);
  
      if (response && response.success) {
        return {
          props: {
            recipe: response.data,
            error: false,
          },
        };
      } else {
        return {
          props: {
            recipe: null,
            error: true,
          },
        };
      }
    } catch (error) {
      return {
        props: {
          recipe: null,
          error: true,
        },
      };
    }
  };

export default EditRecipePage;
