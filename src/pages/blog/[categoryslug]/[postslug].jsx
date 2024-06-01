import { fetchDatoCMS, GET_POST_BY_SLUG, GET_ALL_POSTS } from '@/lib/datocms';
import Layout from '@/components/layout/layout';
import Image from 'next/image';
import Link from 'next/link';

const PostPage = ({ post, category }) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-0">{post.title}</h1>
        <div className="text-lg mb-4">
          <Link href="/blog/">Cooking &amp; Food Blog</Link> / <Link href={`/blog/${category.slug}`}>{category.title}</Link>
        </div>
        {post.picture && (
          <Image
            src={post.picture.url}
            alt={post.title}
            width={800}
            height={600}
            className="mb-6 rounded"
          />
        )}
        <div className="prose">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </div>
      </div>
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
      category: post.category,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}

export default PostPage;
