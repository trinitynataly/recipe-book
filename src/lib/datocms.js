/*
Version: 1.7
Last edited by: Natalia Pakhomova
Last edit date: 03/06/2024
A set of helper functions for fetching data from DatoCMS.
*/

// Import the GraphQLClient from the graphql-request library
import { GraphQLClient } from 'graphql-request';

// Set the DatoCMS GraphQL endpoint
const endpoint = 'https://graphql.datocms.com/';

// Create a new GraphQL client with the DatoCMS endpoint and API token
export const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${process.env.DATOCMS_API_TOKEN}`,
  },
});

/**
 * Fetch data from DatoCMS using a GraphQL query and variables.
 * @param {string} query - the GraphQL query to execute
 * @param {object} variables - the variables to pass to the query
 * @returns {Promise<any>} - the data returned from the query
 */
export const fetchDatoCMS = async (query, variables = {}) => {
    try {
      return await client.request(query, variables);
    } catch (error) {
      console.error(error);
      return {};
    }
};

// Define the GraphQL queries for fetching data from DatoCMS
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

// Define the GraphQL query for fetching all categories from DatoCMS
export const GET_ALL_CATEGORIES = `
  query AllCategories {
    allCategories {
      id
      title
      slug
    }
  }
`;

// Define the GraphQL query for fetching a post by its slug
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
      _firstPublishedAt
    }
  }
`;

// Define the GraphQL query for fetching a category by its slug
export const GET_CATEGORY_BY_SLUG = `
  query GetCategoryBySlug($slug: String) {
    category(filter: { slug: { eq: $slug } }) {
      id
      title
      slug
    }
  }
`;

// Define the GraphQL query for fetching posts by category ID
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
