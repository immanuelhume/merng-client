import { useQuery } from '@apollo/client';
import React, { useContext } from 'react';
import { Card, Header, Transition } from 'semantic-ui-react';
import NewPostCard from '../components/NewPostCard';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth';
import { FETCH_ALL_POSTS_QUERY } from '../utils/gqlqueries';

const Home = () => {
  const { loading, data } = useQuery(FETCH_ALL_POSTS_QUERY);
  const { auth } = useContext(AuthContext);
  if (loading) {
    return <Header size="large">loading...</Header>;
  }
  const { allPosts } = data;
  return (
    <div>
      <Header size="large" style={{ textAlign: 'center' }}>
        Latest Posts
      </Header>
      <Card.Group style={{ justifyContent: 'center' }}>
        {auth && <NewPostCard />}
        <Transition.Group>
          {allPosts.map((post) => {
            return <PostCard key={post.id} post={post} />;
          })}
        </Transition.Group>
      </Card.Group>
    </div>
  );
};

export default Home;
