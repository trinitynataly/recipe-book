/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A view component for displaying a single blog post with title, image, category, and body.
*/

// Import the Fragment component from React for grouping elements
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Image component from Next.js for image optimization
import Image from 'next/image';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the format function from date-fns for date formatting
import { format } from 'date-fns';

/**
 * BlogView component to display a single blog post with title, image, category, and body.
 * BlogView component properties:
 * @param post: the blog post object
 * @returns a view of the blog post
 */
const BlogView = ({ post }) => {
  // Return the blog post view
  return (
    <Fragment>
      {/* Blog post container */}
      <div className="container mx-auto px-4 py-8">
        {/* Blog post title */}
        <h1 className="text-3xl font-bold mb-0">{post.title}</h1>
        {/* Breadcrumbs for the blog post */}
        <div className="text-lg mb-4">
          <Link href="/blog/">Cooking &amp; Food Blog</Link> / <Link href={`/blog/${post.category.slug}`}>{post.category.title}</Link>
        </div>
        {/* Blog post content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Blog post body */}
          <div className="lg:col-span-3">
            {/* Check if the post has a picture */}
            {post.picture && (
              // Display the post picture
              <div className="relative w-full h-96 mb-4 border dark:border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={post.picture.url}
                  alt={post.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            {/* Display the post body with prose class to preserve formatting */}
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.body }} />
            </div>
          </div>
            {/* Blog post metadata */}
          <div className="lg:col-span-1">
            <p><strong>Category:</strong> {post.category.title}</p>
            <p><strong>Published:</strong> {format(new Date(post._firstPublishedAt), 'MM/dd/yyyy')}</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// Validate the function arguments
BlogView.propTypes = {
  post: PropTypes.object.isRequired, // The blog post object
};

export default BlogView;
