import { Fragment, useState, useEffect } from "react";
import Head from 'next/head';
import { useRouter } from 'next/router';
import apiRequest from '@/lib/apiRequest';
import RecipeView from "@/components/recipes/RecipeView";
import Error404 from "@/pages/404";
import { parseCookies, destroyCookie } from 'nookies';

const RecipePage = () => {
  const router = useRouter();
  const cookies = parseCookies();
  const { recipeid } = router.query;
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);

  const fetchRecipe = async () => {
    try {
      if (!recipeid) return;
      const response = await apiRequest(`recipes/${recipeid}`, 'GET');
      if (response && response.success) {
        setRecipe(response.data);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeid]);


  if (error) {
    return <Error404 />;
  }

  const RecipeTitle = recipe ? recipe.title : 'Loading...';

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

export default RecipePage;
