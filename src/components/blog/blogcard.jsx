/*
Version: 1.1
Last edited by: Natalia Pakhomova
Last edit date: 02/06/2024
A card component for displaying blog posts with a title, image, and excerpt.
*/

// Import the Fragment component from React for grouping elements
import { Fragment } from 'react';
// Import PropTypes library for function argument validation
import PropTypes from 'prop-types';
// Import the Link component from Next.js for client-side navigation
import Link from 'next/link';
// Import the Image component from Next.js for image optimization
import Image from 'next/image';
// Import the stripHtml function from the utils library
import { stripHtml } from '@/lib/utils';

/**
 * BlogCard component properties:
 * @param {object} post - the blog post object
 * @returns {JSX.Element} - the blog post card with title, image, and excerpt
 */
const BlogCard = ({ post }) => {

  // Generate the URL for the blog post
  const postUrl = `/blog/${post.category.slug}/${post.slug}`;

  // Return the blog post card
  return (
    <Fragment>
      {/* Card block with border */}
      <div className="border dark:border-gray-300 rounded-lg overflow-hidden shadow-lg relative">
        {/* Image block with link to the post */}
        <Link href={postUrl} className="block w-full h-48 relative">
          {post.picture && ( // Check if the post has a picture
            <Image
              src={post.picture.url}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              priority={false}
              quality={75}
            />
          )}
        </Link>
        {/* Post content block */}
        <div className="p-4">
          {/* Post title */}
          <h2 className="text-xl font-bold mb-2">
            <Link href={postUrl}>{post.title}</Link>
          </h2>
          {/* Post excerpt */}
          <p className="text-gray-700">{stripHtml(post.body, 200)}</p>
          {/* Read more link */}
          <Link href={postUrl} className="mt-4 bg-gray-200 hover:bg-tertiary text-gray-600 hover:text-white px-4 py-2 rounded inline-block">
            Read More...
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

// Validate the function arguments
BlogCard.propTypes = {
  post: PropTypes.object.isRequired, // The blog post object
};

// Export the BlogCard component
export default BlogCard;
