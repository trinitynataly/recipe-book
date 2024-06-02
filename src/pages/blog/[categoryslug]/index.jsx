import { useEffect } from 'react';
import { fetchDatoCMS, GET_POSTS_BY_CATEGORY_ID, GET_CATEGORY_BY_SLUG } from '@/lib/datocms';
import Layout from '@/components/layout/layout';
import { useState } from 'react';
import BlogTable from '@/components/blog/blogtable';

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
        <h1 className="text-3xl font-bold mb-6">{category.title}</h1>
        <BlogTable
          posts={posts}
          page={currentPage}
          totalPages={totalPages}
         />
        </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const { categoryslug } = context.params;
  const page = parseInt(context.query.page) || 1;
  const skip = (page - 1) * POSTS_PER_PAGE;

  const { category } = await fetchDatoCMS(GET_CATEGORY_BY_SLUG, { slug: categoryslug });
  if (!category) {
    return {
      notFound: true,
    };
  }

  const data = await fetchDatoCMS(GET_POSTS_BY_CATEGORY_ID, {
    category: category.id,
    first: POSTS_PER_PAGE,
    skip: skip,
  });

  return {
    props: {
      category,
      initialPosts: data.allPosts,
      totalPosts: data._allPostsMeta.count,
      currentPage: page,
    },
  };
}


export default CategoryPage;
