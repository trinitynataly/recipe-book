import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://graphql.datocms.com/';

export const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
  },
});

export const fetchDatoCMS = async (query, variables = {}) => {
    try {
        const data = await client.request(query, variables);
        return data;
    } catch (error) {
        return {};
    }
};

export const GET_ALL_POSTS = `
  query AllPosts {
    allPosts {
      id
      title
      slug
      picture {
        url
      }
      category {
        id
        title
        slug
      }
      body
    }
  }
`;

export const GET_ALL_CATEGORIES = `
  query AllCategories {
    allCategories {
      id
      title
      slug
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: String) {
    post(filter: { slug: { eq: $slug } }) {
      id
      title
      slug
      picture {
        url
      }
      category {
        id
        title
        slug
      }
      body
    }
  }
`;

export const GET_CATEGORY_BY_SLUG = `
  query GetCategoryBySlug($slug: String) {
    category(filter: { slug: { eq: $slug } }) {
      id
      title
      slug
    }
  }
`;

export const GET_POSTS_BY_CATEGORY_ID = `
  query GetPostsByCategoryId($category: ItemId, $first: IntType, $skip: IntType) {
    allPosts(filter: { category: { eq: $category } }, first: $first, skip: $skip, orderBy: _createdAt_DESC) {
      id
      title
      slug
      picture {
        url
      }
      category {
        id
        title
        slug
      }
      body
    }
    _allPostsMeta(filter: { category: { eq: $category } }) {
      count
    }
  }
`;
