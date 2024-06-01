import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchDatoCMS, GET_POSTS_BY_CATEGORY_ID, GET_ALL_CATEGORIES } from '@/lib/datocms';
import Layout from '@/components/layout/layout';
import { useBlog } from '@/context/BlogContext';

const POSTS_PER_PAGE = 3;

const BlogPage = ({ postsByCategory }) => {
  const { categories } = useBlog();

  return (
    <Fragment>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Cooking &amp; Food Blog</h1>
          {categories.map((category) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {postsByCategory[category.id].map((post) => (
                  <div key={post.id} className="border p-4 rounded-lg">
                    <Link href={`/blog/${post.category.slug}/${post.slug}`}>
                        {post.picture && (
                          <Image
                            src={post.picture.url}
                            alt={post.title}
                            width={600}
                            height={400}
                            className="mb-4 rounded"
                          />
                        )}
                        <h3 className="text-xl font-semibold">{post.title}</h3>
                    </Link>
                  </div>
                ))}
              </div>
              <Link href={`/blog/${category.slug}`} className="text-blue-500 hover:underline">See more in {category.title}</Link>
            </div>
          ))}
        </div>
      </Layout>
    </Fragment>
  );
};

export async function getStaticProps() {
  const { allCategories } = await fetchDatoCMS(GET_ALL_CATEGORIES);

  const postsByCategory = {};
  const totalPostsByCategory = {};

  for (const category of allCategories) {
    const data = await fetchDatoCMS(GET_POSTS_BY_CATEGORY_ID, {
      category: category.id,
      first: POSTS_PER_PAGE,
      skip: 0,
    });
    postsByCategory[category.id] = data.allPosts;
    totalPostsByCategory[category.id] = data._allPostsMeta.count;
  }

  return {
    props: {
      postsByCategory,
      totalPostsByCategory,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default BlogPage;
