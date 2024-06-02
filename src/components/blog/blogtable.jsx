import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import BlogCard from './blogcard';

const BlogTable = ({ posts, page = 1, totalPages = 1 }) => {
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
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard key={post.id} post={post} categorySlug={router.query.categoryslug} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No posts found.
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

BlogTable.propTypes = {
  title: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired
};

export default BlogTable;
