import { Fragment } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

const BlogView = ({ post }) => {
    return (
    <Fragment>
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-0">{post.title}</h1>
            <div className="text-lg mb-4">
                <Link href="/blog/">Cooking &amp; Food Blog</Link> / <Link href={`/blog/${post.category.slug}`}>{post.category.title}</Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    {post.picture && (
                    <div className="relative w-full h-96 mb-4 border dark:border-gray-300 rounded-lg shadow-lg overflow-hidden">
                        <Image
                            src={post.picture.url}
                            alt={post.title}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    )}
                    <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.body }} />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <p><strong>Category:</strong> {post.category.title}</p>
                    <p><strong>Published:</strong> {format(new Date(post._firstPublishedAt), 'MM/dd/yyyy')}</p>
                </div>
            </div>
        </div>
    </Fragment>
  );
};

export default BlogView;
