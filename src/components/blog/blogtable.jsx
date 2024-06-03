/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A table component for displaying blog posts with pagination controls.
*/

// Import the Fragment component from React for grouping elements
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the useRouter hook from Next.js for client-side navigation
import { useRouter } from 'next/router';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the BlogCard component for displaying blog posts
import BlogCard from './blogcard';

/**
 * BlogTable component to display a list of blog posts with pagination controls.
 * BlogTable component properties:
 * @param {array} posts - the list of blog posts
 * @param {number} page - the current page number
 * @param {number} totalPages - the total number of pages
 * @returns {JSX.Element} - the blog post table with pagination controls
 */
const BlogTable = ({ posts, page = 1, totalPages = 1 }) => {
  
  // Get the router object for client-side navigation
  const router = useRouter();

  // Function to generate the link for a specific page
  const getPageLink = (newPage) => {
    // Clone the current query parameters
    const query = { ...router.query };
    // Check if the new page is the first page
    if (newPage === 1) {
      // Remove the page parameter from the query if it is the first page to keep the URL clean
      delete query.page;
    } else {
      // Add the new page parameter to the query as ?page=newPage
      query.page = newPage;
    }
    // Return the new page link with the updated query parameters
    return { pathname: router.pathname, query };
  };

  // Return the blog post table with pagination controls
  return (
    <Fragment>
      {/* Title of the blog post table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {/* Check if there are any posts to display */}
        {posts.length > 0 ? (
          // Map through the list of posts and display each post using the BlogCard component
          posts.map((post) => (
            <BlogCard key={post.id} post={post} categorySlug={router.query.categoryslug} />
          ))
        ) : (
          // Display a message if no posts are found
          <div className="col-span-full text-center text-gray-500">
            No posts found.
          </div>
        )}
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        // Display the pagination controls if there is more than one page
        <div className="flex justify-between items-center mt-8">
          {/* Previous page link */}
          <Link
            href={getPageLink(page - 1)}
            className={`bg-gray-300 text-gray-800 px-4 py-2 rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={page === 1}
          >
            Previous
          </Link>
          {/* Page number information */}
          <span>
            Page {page} of {totalPages}
          </span>
          {/* Next page link */}
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

// Validate the function arguments
BlogTable.propTypes = {
  posts: PropTypes.array.isRequired, // The list of blog posts
  page: PropTypes.number, // The current page number (default is 1)
  totalPages: PropTypes.number // The total number of pages (default is 1)
};

// Export the BlogTable component
export default BlogTable;
