import { Fragment } from "react";
import Head from 'next/head';
import apiRequest from '@/lib/apiRequest';
import RecipeView from "@/components/recipes/recipeview";
import { slugify } from "@/lib/utils";
import Error404 from "@/pages/404";

const RecipePage = ({ recipe, error }) => {
  if (error) {
    return <Error404 />;
  }

  const RecipeTitle = recipe.title;

  return (
    <Fragment>
      <Head>
        <title>{RecipeTitle} | Recipe Book</title>
        <meta name="description" content="View detailed information about a recipe" />
      </Head>
      <RecipeView recipe={recipe} />
    </Fragment>
  );
};

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
            destination: `/recipes/${recipeCategorySlug}/${recipeslug}`,
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

export default RecipePage;
