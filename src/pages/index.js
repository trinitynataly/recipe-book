import { Fragment } from "react";
import Head from 'next/head';
import Layout from "@/components/layout/layout";
import RecipeTable from "@/components/recipes/recipetable";
import apiRequest from '@/lib/apiRequest';

const Home = ({ recipes, pagination }) => {
  const { currentPage, totalPages } = pagination;
  return (
    <Fragment>
      <Head>
        <title>Welcome | Recipe Book</title>
        <meta name="description" content="Welcome to Recipe Book App" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <RecipeTable
            title="Recipe Book"
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
  let data = {
    page,
  }

  try {
    const response = await apiRequest(`recipes`, 'GET', data, context);
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

export default Home;
