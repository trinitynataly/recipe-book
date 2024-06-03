/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
Category page displaying a list of blog posts by category
*/

// Import the Fragment from React
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the fetchDatoCMS function from the datocms library and queries for fetching data
import { fetchDatoCMS, GET_POSTS_BY_CATEGORY_ID, GET_CATEGORY_BY_SLUG } from '@/lib/datocms';
// Import the Layout component for the page layout
import Layout from '@/components/layout/layout';
// Import the BlogTable component for displaying blog posts
import { useState } from 'react';
// Import the fetchDatoCMS function from the datocms library and queries for fetching data
import BlogTable from '@/components/blog/blogtable';

// Define the number of posts per page
const POSTS_PER_PAGE = 12;

/**
 * CategoryPage component to display a list of blog posts by category.
 * @param {object} category - the category object
 * @param {array} posts - the list of posts
 * @param {number} totalPosts - the total number of posts
 * @param {number} currentPage - the current page number
 * @returns {JSX.Element}
 */

const CategoryPage = ({ category, posts, totalPosts, currentPage }) => {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Function to fetch more posts
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>{category.title} | Cooking & Food Blog | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content={`Cooking and food blog with recipes, tips, and tricks for ${category.title}`} />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Blog category page */}
        <div className="container mx-auto px-4 py-8">
          {/* Category title */}
          <h1 className="text-3xl font-bold mb-6">{category.title}</h1>
          {/* Blog posts table */}
          <BlogTable
            posts={posts}
            page={currentPage}
            totalPages={totalPages}
           />
          </div>
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the CategoryPage component
CategoryPage.propTypes = {
  category: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  totalPosts: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
};

// Define the server-side data fetching function
export const getServerSideProps = async (context) => {
  // Get the categoryslug from the context parameters
  const { categoryslug } = context.params;
  // Get the page number from the context query
  const page = parseInt(context.query.page) || 1;
  // Calculate the number of posts to skip
  const skip = (page - 1) * POSTS_PER_PAGE;

  // Fetch the category by slug
  const { category } = await fetchDatoCMS(GET_CATEGORY_BY_SLUG, { slug: categoryslug });
  // Check if the category exists
  if (!category) {
    // Return a 404 error if the category does not exist
    return {
      notFound: true,
    };
  }

  // Fetch the posts by category id via DatoCMS API
  const data = await fetchDatoCMS(GET_POSTS_BY_CATEGORY_ID, {
    category: category.id, // Pass the category id
    first: POSTS_PER_PAGE, // Limit to 12 posts
    skip: skip, // Skip posts based on the page number
  });

  // Return the props for the CategoryPage component
  return {
    props: {
      category, // Pass the category object as a prop
      posts: data.allPosts, // Pass the list of posts
      totalPosts: data._allPostsMeta.count, // Pass the total number of posts
      currentPage: page, // Pass the current page number
    },
  };
}


export default CategoryPage;
