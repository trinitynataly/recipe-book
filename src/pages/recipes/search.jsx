import { Fragment } from "react";
import Head from 'next/head';
import Layout from "@/components/layout/layout";
import RecipeTable from "@/components/recipes/recipetable";
import apiRequest from '@/lib/apiRequest';

const SearchResults = ({ keyword, recipes, pagination }) => {
  if (!keyword) {
    return null;
  }

  const { currentPage, totalPages } = pagination;

  return (
    <Fragment>
      <Head>
        <title>Search Results for &quot;{keyword}&quot; | Recipe Book</title>
        <meta name="description" content={`Search results for "${keyword}"`} />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <RecipeTable
            title={`Search Results for "${keyword}"`}
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
  const keyword = context.query.keyword || '';
  const page = parseInt(context.query.page) || 1;
  let recipes = [];
  let pagination = {};

  if (!keyword) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  if (keyword) {
    const data = {
      keyword,
      page,
    };
    try {
      const response = await apiRequest(`recipes/search`, 'GET', data, context);
      if (response.success) {
        recipes = response.data;
        pagination = response.pagination;
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  }

  return {
    props: {
      keyword,
      recipes,
      pagination,
    },
  };
};

export default SearchResults;
