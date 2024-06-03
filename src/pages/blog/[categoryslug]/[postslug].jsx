/*
Version: 1.3
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
Post page displaying a single blog post
*/

// Import the Fragment from React
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Head component from Next.js for SEO
import Head from 'next/head';
// Import the fetchDatoCMS function from the datocms library and queries for fetching data
import { fetchDatoCMS, GET_POST_BY_SLUG } from '@/lib/datocms';
// Import the Layout component for the page layout
import Layout from '@/components/layout/layout';
// Import the BlogView component for displaying a single blog post
import BlogView from '@/components/blog/blogview';

/**
 * PostPage component to display a single blog post.
 * @param {object} post - the post object
 * @returns {JSX.Element}
  */
const PostPage = ({ post }) => {
  // Return the post page view
  return (
    <Fragment>
      {/* Head component for SEO */}
      <Head>
        {/* Page title */}
        <title>{post.title} | {post.category.title} | Cooking & Food Blog | Recipe Book</title>
        {/* Page meta description */}
        <meta name="description" content={`Cooking and food blog with recipes, tips, and tricks for ${post.category.title}`} />
      </Head>
      {/* Layout wrapper */}
      <Layout>
        {/* Post view */}
        <BlogView post={post} />
      </Layout>
    </Fragment>
  );
};

// Validate the props passed to the PostPage component
PostPage.propTypes = {
  post: PropTypes.object.isRequired,
};

// Fetch the post data by slug
export async function getServerSideProps({ params }) {
  // Get the post slug from the URL parameters
  const { categoryslug, postslug } = params;
  // Fetch the post data by slug
  const { post } = await fetchDatoCMS(GET_POST_BY_SLUG, { slug: postslug });
  if (!post) {
    // Return a 404 error if the post is not found
    return {
      notFound: true,
    };
  } else {
    // Redirect to the correct URL if the category slug does not match
    if (post.category.slug !== categoryslug) {
      return {
        redirect: {
          destination: `/blog/${post.category.slug}/${post.slug}`,
          permanent: true,
        },
      };
    } else {
      // Return the post data as props
      return {
        // Pass the post data as props
        props: {
          post, // the post object
        }
      };
    }
  }
}

//
export default PostPage;
