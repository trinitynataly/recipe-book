import { Fragment } from "react";
import Head from 'next/head';
import Layout from "@/components/layout/layout";
import apiRequest from '@/lib/apiRequest';
import RecipeView from "@/components/recipes/recipeview";
import { slugify } from "@/lib/utils";

const RecipePage = ({ recipe }) => {

  return (
    <Fragment>
      <Head>
        <title>{recipe.title} | Recipe Book</title>
        <meta name="description" content="View detailed information about a recipe" />
      </Head>
      <Layout>
        <RecipeView recipe={recipe} />
      </Layout>
    </Fragment>
  );
};

export const getServerSideProps = async (context) => {
  const { categoryslug, recipeslug } = context.query;

  if (!recipeslug) {
    return {
      notFound: true,
    };
  }

  try {
    const response = await apiRequest(`recipes/${recipeslug}`, 'GET', null, context);

    if (response && response.success) {
      const recipeCategorySlug = slugify(response.data.type);
      if (recipeCategorySlug !== categoryslug) {
        return {
          redirect: {
            destination: `/recipes/${recipeCategorySlug}/${recipeslug}`,
            permanent: true,
          },
        };
      } else {
        return {
          props: {
            recipe: response.data,
          },
        };
      }
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default RecipePage;
