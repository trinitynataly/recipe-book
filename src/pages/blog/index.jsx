/*
Version: 1.5
Last edited by: Natalia Pakhomova
Last edit date: 01/06/2024
Blog section index page displaying top 3 posts from each category
*/

// Import the Fragment component from React
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the Image component from Next.js for image optimization
import Link from 'next/link';
// Import the fetchDatoCMS function from the datocms library and queries for fetching data
import { fetchDatoCMS, GET_POSTS_BY_CATEGORY_ID, GET_ALL_CATEGORIES } from '@/lib/datocms';
// Import the Layout component for the page layout
import Layout from '@/components/layout/layout';
// Import the useBlog hook from the BlogContext
import { useBlog } from '@/context/BlogContext';
// Import the BlogTable component for displaying blog posts
import BlogTable from '@/components/blog/blogtable';

// Define the number of posts per page
const POSTS_PER_PAGE = 3;

/**
 * BlogPage component to display the blog section index page with top 3 posts from each category.
 * @param {object} postsByCategory - the list of posts grouped by category
 * @returns {JSX.Element}
 */
const BlogPage = ({ postsByCategory }) => {
  // Get the categories from the BlogContext
  const { categories } = useBlog();
  // Return the blog section index page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>Cooking & Food Blog | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content="Cooking and food blog with recipes, tips, and tricks" />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Blog section index page */}
        <div className="container mx-auto px-4 py-8">
          {/* Blog section title */}
          <h1 className="text-3xl font-bold mb-6">Cooking &amp; Food Blog</h1>
          {/* Blog section categories */}
          {categories.map((category) => (

            <div key={category.id} className="mb-8">
              {/* Category title with link separated by hr from the previous block */}
              <hr className="my-6" />
              <Link href={`/blog/${category.slug}`} passHref>
                <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
                </Link>
              {/* Blog posts table */}
              <BlogTable posts={postsByCategory[category.id]} />
              {/* See more link */}
              <div className="mt-4">
                <Link href={`/blog/${category.slug}`} className="text-primary hover:text-tertiary">See more in {category.title} &gt;&gt;</Link>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </Fragment>
  );
};

// Validate the postsByCategory prop
BlogPage.propTypes = {
  postsByCategory: PropTypes.object.isRequired,
};

// Define the function for fetching page props
export async function getStaticProps() {
  // Fetch all categories from DatoCMS
  const { allCategories } = await fetchDatoCMS(GET_ALL_CATEGORIES);
  // Initialize the postsByCategory object
  const postsByCategory = {};
  // Initialize the totalPostsByCategory object
  const totalPostsByCategory = {};

  // Loop through all categories and fetch top 3 posts for each category
  for (const category of allCategories) {
    // Fetch top 3 posts for the current category
    const data = await fetchDatoCMS(GET_POSTS_BY_CATEGORY_ID, {
      category: category.id, // Filter by category ID
      first: POSTS_PER_PAGE, // Limit to 3 posts
      skip: 0, // Skip 0 posts
    });
    // Add the posts and total count to the postsByCategory and totalPostsByCategory objects
    postsByCategory[category.id] = data.allPosts;
    totalPostsByCategory[category.id] = data._allPostsMeta.count;
  }

  // Return the props for the BlogPage component
  return {
    props: {
      postsByCategory, // Pass the postsByCategory object as a prop
      totalPostsByCategory, // Pass the totalPostsByCategory object as a prop
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default BlogPage;
