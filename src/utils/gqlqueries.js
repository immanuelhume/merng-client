import gql from "graphql-tag";

export const FETCH_ALL_POSTS_QUERY = gql`
  {
    allPosts {
      id
      username
      createdAt
      body
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        username
        body
        createdAt
      }
    }
  }
`;

export const FETCH_POST_QUERY = gql`
  query($id: ID!) {
    post(id: $id) {
      id
      body
      username
      createdAt
      likeCount
      commentCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export const POSTS_QUERY = gql`
  query getPosts($first: Int, $after: String, $sortBy: String) {
    posts(first: $first, after: $after, sortBy: $sortBy) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          body
          username
          createdAt
          commentCount
          likeCount
          comments {
            id
            username
            createdAt
            body
          }
          likes {
            id
            username
            createdAt
          }
        }
      }
    }
  }
`;
