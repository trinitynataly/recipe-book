import { Fragment } from "react";
import Head from 'next/head';
import Layout from "@/components/layout/layout";
import RecipeTable from "@/components/recipes/RecipeTable";
import apiRequest from '@/lib/apiRequest';

const Lunch = ({ recipes, pagination }) => {
  const { currentPage, totalPages } = pagination;

  return (
    <Fragment>
      <Head>
        <title>Lunch Recipes | Recipe Book</title>
        <meta name="description" content="Lunch Recipes" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <RecipeTable
            title="Lunch Recipes"
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
  let pagination = {};

  try {
    const response = await apiRequest(`recipes?type=lunch&page=${page}`, 'GET', null, context);
    if (response.success) {
      recipes = response.data;
      pagination = response.pagination;
    }
  } catch (error) {
    console.error('Error fetching lunch recipes:', error);
  }

  return {
    props: {
      recipes,
      pagination,
    },
  };
};

export default Lunch;
