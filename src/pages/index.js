import { Fragment, useEffect, useState } from "react";
import withAuth from "@/middleware/withAuth";
import Layout from "@/components/layout/layout";
import useApi from "@/hooks/useApi";
import RecipeCard from "@/components/recipes/RecipeCard";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiRequest = useApi();

  const fetchRecipes = async () => {
    try {
      const response = await apiRequest('recipes', 'GET', { page });
      if (!response || !response.success) {
        return;
      }
      setRecipes(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      // Handle other errors if needed
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      fetchRecipes();
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchRecipes();      
    }
  };

  return (
    <Fragment>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Recipe Book</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
          {totalPages > 1 && (
            <>
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </Layout>
    </Fragment>
  );
}

export default withAuth(Home, { isAdminRequired: false });
