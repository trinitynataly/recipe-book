import { Fragment } from "react";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import RecipeCard from "@/components/recipes/RecipeCard";

const RecipeTable = ({ title, recipes, page = 1, totalPages = 1 }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = loading ? null : session?.user;
  const router = useRouter();

  const getPageLink = (newPage) => {
    const query = { ...router.query };
    if (newPage === 1) {
      delete query.page;
    } else {
      query.page = newPage;
    }
    return { pathname: router.pathname, query };
  };

  return (
    <Fragment>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} user={user} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No recipes found.
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <Link
            href={getPageLink(page - 1)}
            className={`bg-gray-300 text-gray-800 px-4 py-2 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={page === 1}
          >
            Previous
          </Link>
          <span>
            Page {page} of {totalPages}
          </span>
          <Link
            href={getPageLink(page + 1)}
            className={`bg-gray-300 text-gray-800 px-4 py-2 rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={page === totalPages}
          >
            Next
          </Link>
        </div>
      )}
    </Fragment>
  );
};

RecipeTable.propTypes = {
  title: PropTypes.string.isRequired,
  recipes: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default RecipeTable;
