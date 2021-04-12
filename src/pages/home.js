import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext } from "react";
import { Button, Card, Grid, Header, Transition } from "semantic-ui-react";
import NewPostCard from "../components/NewPostCard";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import { FETCH_ALL_POSTS_QUERY } from "../utils/gqlqueries";

// TODO implement see more button
// TODO sort button

const Home = () => {
  const { loading, error, data } = useQuery(FETCH_ALL_POSTS_QUERY);
  const { auth } = useContext(AuthContext);
  if (loading) {
    return <Header size="large">loading...</Header>;
  }
  if (error) {
    console.log(JSON.stringify(error, null, 2));
    return <Header size="large">error!</Header>;
  }
  const { allPosts } = data;
  return (
    <div>
      <Header size="large" style={{ textAlign: "center" }}>
        Recent Posts
      </Header>
      <Card.Group style={{ justifyContent: "center" }}>
        {auth && <NewPostCard />}
        {/* BUG transition does not work */}
        <Transition.Group>
          {allPosts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </Transition.Group>
      </Card.Group>
      <Grid>
        <Grid.Column textAlign="center">
          <Button>load more</Button>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const POSTS_QUERY = gql`
  query getPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
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

export default Home;
