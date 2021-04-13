import { NetworkStatus, useQuery } from "@apollo/client";
import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Header,
  Popup,
  Transition,
} from "semantic-ui-react";
import NewPostCard from "../components/NewPostCard";
import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import { POSTS_QUERY } from "../utils/gqlqueries";

// TODO sort button
// TODO back to top button

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [sortDesc, setSortDesc] = useState(true);

  // set up auto infinite scroll here
  // clicks button automatically when load more button is scrolled
  // into view
  // BUG does not click!
  const loadMoreButtonRef = useRef(null);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    POSTS_QUERY,
    {
      variables: {
        sortBy: sortDesc ? "desc" : "asc",
      },
      fetchPolicy: "network-only",
    }
  );
  if (loading) {
    return <Header size="large">loading...</Header>;
  }
  if (error) {
    console.log(JSON.stringify(error, null, 2));
    return <Header size="large">error!</Header>;
  }
  const {
    posts: { pageInfo, edges: posts },
  } = data;
  const isRefetching = networkStatus === NetworkStatus.fetchMore;

  return (
    <div>
      <Header size="large" style={{ textAlign: "center" }}>
        Recent Posts
      </Header>
      <Popup
        content={
          sortDesc ? "Sort oldest posts first" : "Sort latest posts first"
        }
        inverted
        trigger={
          <Button
            floated="right"
            icon={
              sortDesc ? "sort content ascending" : "sort content descending"
            }
            onClick={() => {
              setSortDesc(!sortDesc);
              refetch();
            }}
          ></Button>
        }
      />
      <Card.Group style={{ justifyContent: "center" }}>
        {auth && <NewPostCard />}
        {/* BUG transition does not work */}
        <Transition.Group>
          {posts.map((post) => {
            return <PostCard key={post.node.id} post={post.node} />;
          })}
        </Transition.Group>
      </Card.Group>
      {/* BUG button is not set to loading when fetchMore */}
      {pageInfo.hasNextPage && (
        <Grid>
          <Grid.Column textAlign="center">
            <Button
              ref={loadMoreButtonRef}
              disabled={isRefetching}
              loading={isRefetching}
              onClick={() => {
                fetchMore({
                  variables: {
                    after: pageInfo.endCursor,
                  },
                });
              }}
            >
              load more
            </Button>
          </Grid.Column>
        </Grid>
      )}
    </div>
  );
};

export default Home;
