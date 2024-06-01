import { Fragment } from "react";
import Head from 'next/head';
import Layout from "@/components/layout/layout";
import RecipeTable from "@/components/recipes/RecipeTable";
import apiRequest from '@/lib/apiRequest';

const Favorites = ({ recipes, pagination }) => {
  
  const { currentPage, totalPages } = pagination;

  return (
    <Fragment>
      <Head>
        <title>My Favourite Recipes | Recipe Book</title>
        <meta name="description" content="My Favourite Recipes" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <RecipeTable
            title="My Favourite Recipes"
            recipes={recipes}
            page={currentPage}
            totalPages={totalPages}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

export const getServerSideProps = async (context) => {
  const page = parseInt(context.query.page) || 1;
  let recipes = [];
  let pagination = {
    currentPage: 1,
    totalPages: 1,
  };
  let data = {
    page,
  }

  try {
    const response = await apiRequest(`recipes/favorites`, 'GET', data, context);
    if (response.success) {
      recipes = response.data;
      pagination = response.pagination;
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }

  return {
    props: {
      recipes,
      pagination,
    },
  };
};

export default Favorites;
