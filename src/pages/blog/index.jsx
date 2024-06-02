import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchDatoCMS, GET_POSTS_BY_CATEGORY_ID, GET_ALL_CATEGORIES } from '@/lib/datocms';
import Layout from '@/components/layout/layout';
import { useBlog } from '@/context/BlogContext';
import BlogTable from '@/components/blog/blogtable';

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
              <hr className="my-6" />
              <Link href={`/blog/${category.slug}`} passHref>
                <h2 className="text-2xl font-semibold mb-4">{category.title}</h2>
                </Link>
              <BlogTable posts={postsByCategory[category.id]} />
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
