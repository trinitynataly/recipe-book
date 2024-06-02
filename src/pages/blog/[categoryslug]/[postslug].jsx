import { fetchDatoCMS, GET_POST_BY_SLUG, GET_ALL_POSTS } from '@/lib/datocms';
import Layout from '@/components/layout/layout';
import BlogView from '@/components/blog/blogview';

const PostPage = ({ post }) => {
  return (
    <Layout>
      <BlogView post={post} />
    </Layout>
  );
};

export async function getStaticPaths() {
  const { allPosts } = await fetchDatoCMS(GET_ALL_POSTS);
  const paths = allPosts.map((post) => ({
    params: { categoryslug: post.category.slug, postslug: post.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { postslug } = params;
  const { post } = await fetchDatoCMS(GET_POST_BY_SLUG, { slug: postslug });

  return {
    props: {
      post,
    }
  };
}

export default PostPage;
