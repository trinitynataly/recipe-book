import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { stripHtml } from '@/lib/utils';

const BlogCard = ({ post }) => {
  const postUrl = `/blog/${post.category.slug}/${post.slug}`;

  return (
    <div className="border dark:border-gray-300 rounded-lg overflow-hidden shadow-lg relative">
      <Link href={postUrl} className="block w-full h-48 relative">
        {post.picture ? (
          <Image
            src={post.picture.url}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-gray-200 w-full h-full"></div>
        )}
      </Link>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">
          <Link href={postUrl}>{post.title}</Link>
        </h2>
        <p className="text-gray-700">{stripHtml(post.body, 200)}</p>
        <Link href={postUrl} className="mt-4 bg-gray-200 hover:bg-tertiary text-gray-600 hover:text-white px-4 py-2 rounded inline-block">
          Read More...
        </Link>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  post: PropTypes.object.isRequired,
  categorySlug: PropTypes.string.isRequired,
};

export default BlogCard;
