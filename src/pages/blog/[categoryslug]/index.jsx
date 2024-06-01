import { useEffect } from 'react';
import { fetchDatoCMS, GET_POSTS_BY_CATEGORY_ID, GET_CATEGORY_BY_SLUG, GET_ALL_CATEGORIES } from '@/lib/datocms';
import Layout from '@/components/layout/layout';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

const POSTS_PER_PAGE = 12;

const CategoryPage = ({ category, initialPosts, totalPosts }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(totalPosts / POSTS_PER_PAGE));

  useEffect(() => {
    setPosts(initialPosts);
    setTotalPages(Math.ceil(totalPosts / POSTS_PER_PAGE));
  }, [initialPosts, totalPosts]);

  const fetchMorePosts = async (page) => {
    const data = await fetchDatoCMS(GET_POSTS_BY_CATEGORY_ID, {
      category: category.id,
      first: POSTS_PER_PAGE,
      skip: (page - 1) * POSTS_PER_PAGE,
    });
    setPosts(data.allPosts);
    setCurrentPage(page);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6"><Link href="/blog/">Cooking &amp; Food Blog</Link> / {category.title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-lg">
              <Link href={`/blog/${category.slug}/${post.slug}`} passHref>
                <div>
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
                </div>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-4 py-2 border ${index + 1 === currentPage ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => fetchMorePosts(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export async function getStaticPaths() {
  const { allCategories } = await fetchDatoCMS(GET_ALL_CATEGORIES);
  const paths = allCategories.map((category) => ({
    params: { categoryslug: category.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { categoryslug } = params;
  const { category } = await fetchDatoCMS(GET_CATEGORY_BY_SLUG, { slug: categoryslug });

  const data = await fetchDatoCMS(GET_POSTS_BY_CATEGORY_ID, {
    category: category.id,
    first: POSTS_PER_PAGE,
    skip: 0,
  });

  return {
    props: {
      category,
      initialPosts: data.allPosts,
      totalPosts: data._allPostsMeta.count,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default CategoryPage;
