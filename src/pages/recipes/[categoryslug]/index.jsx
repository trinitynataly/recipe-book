import { Fragment } from "react";
import Head from 'next/head';
import Layout from "@/components/layout/layout";
import RecipeTable from "@/components/recipes/recipetable";
import apiRequest from '@/lib/apiRequest';
import { useRouter } from 'next/router';
import categories from '@/data/categories.json';

const RecipeCategory = ({ recipes, pagination }) => {
  const router = useRouter();
  const { categoryslug } = router.query;
  const category = categories.find(cat => cat.slug === categoryslug);
  const categoryTitle = category ? category.name : 'Recipes';

  return (
    <Fragment>
      <Head>
        <title>{categoryTitle} Recipes | Recipe Book</title>
        <meta name="description" content={`${categoryTitle} Recipes`} />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <RecipeTable
            title={`${categoryTitle} Recipes`}
            recipes={recipes}
            page={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        </div>
      </Layout>
    </Fragment>
  );
};

export const getServerSideProps = async (context) => {
  const { categoryslug } = context.params;
  const page = parseInt(context.query.page) || 1;
  const category = categories.find(cat => cat.slug === categoryslug);
  
  if (!category) {
    return {
      notFound: true,
    };
  }
  
  let recipes = [];
  let pagination = {};
  let data = {
    type: category.name,
    page,
  };

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

export default RecipeCategory;
