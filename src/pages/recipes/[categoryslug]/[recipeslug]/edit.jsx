import { Fragment } from "react";
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from "@/components/layout/layout";
import RecipeForm from "@/components/recipes/recipeform";
import { useToast } from "@/context/ToastContext";
import { slugify } from "@/lib/utils";
import apiRequest from '@/lib/apiRequest';
import Error404 from "@/pages/404";


const EditRecipePage = ({ recipe, error }) => {
    const router = useRouter();
    const { showToast } = useToast();
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const user = loading ? null : session?.user;
    const isAuthorOrAdmin = user && (user.isAdmin || user.id === recipe.authorID);
    if (error || !isAuthorOrAdmin) {
        return <Error404 />;
      }
    const handleSubmit = async (formData) => {
        try {
            const response = await apiRequest(`recipes/${recipe._id}`, 'PUT', formData);
            if (response.success) {
              router.push(`/recipes/${slugify(response.data.type)}/${response.data.slug}`);
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
    const { categoryslug, recipeslug } = context.query;
  
    if (!recipeslug) {
      return {
        props: {
          recipe: null,
          error: true,
        },
      };
    }
  
    try {
      const response = await apiRequest(`recipes/${recipeslug}`, 'GET', null, context);
  
      if (response && response.success) {
        const recipeCategorySlug = slugify(response.data.type);
        if (recipeCategorySlug !== categoryslug) {
          return {
            redirect: {
              destination: `/recipes/${recipeCategorySlug}/${recipeslug}/edit`,
              permanent: true,
            },
          };
        } else {
          return {
            props: {
              recipe: response.data,
              error: false,
            },
          };
        }
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
