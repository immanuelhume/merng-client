import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Label } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import HoverPopup from './HoverPopup';

const LikeButton = ({ likeCount, likes, postId, floated }) => {
  const { auth } = useContext(AuthContext);
  const activeUser = auth ? auth.username : null;
  const liked = likes.find((like) => like.username === activeUser);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { id: postId },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
  });

  function toggleLike(e) {
    e.preventDefault();
    likePost();
  }

  return (
    <HoverPopup content="Like this post">
      {/* BUG popup in wrong position on post page */}
      <Button
        as="div"
        labelPosition="right"
        onClick={toggleLike}
        floated={floated}
      >
        {activeUser ? (
          liked ? (
            <Button color="teal">
              <Icon name="thumbs up" />
            </Button>
          ) : (
            <Button color="teal" basic>
              <Icon name="thumbs up" />
            </Button>
          )
        ) : (
          <Button color="teal" basic as={Link} to="/login">
            <Icon name="thumbs up" />
          </Button>
        )}

        <Label as="a" basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </HoverPopup>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($id: ID!) {
    likePost(id: $id) {
      id
      likeCount
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default LikeButton;
