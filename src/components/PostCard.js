import moment from 'moment';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Label } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import DeleteButton from './DeleteButton';
import HoverPopup from './HoverPopup';
import LikeButton from './LikeButton';

const PostCard = ({ post }) => {
  const { auth } = useContext(AuthContext);
  const activeUser = auth ? auth.username : null;

  return (
    <Card>
      <Card.Content as={Link} to={`/post/${post.id}`}>
        <Card.Header>{post.username}</Card.Header>
        <Card.Meta>{moment(post.createdAt).fromNow()}</Card.Meta>
        <Card.Description>{post.body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton
          likeCount={post.likeCount}
          likes={post.likes}
          postId={post.id}
        />
        <HoverPopup content="Comment on this post">
          <Button as="div" labelPosition="right">
            <Button color="teal" basic as={Link} to={`post/${post.id}`}>
              <Icon name="comments" />
            </Button>
            <Label as="a" basic color="teal" pointing="left">
              {post.commentCount}
            </Label>
          </Button>
        </HoverPopup>
        {activeUser === post.username && (
          <HoverPopup content="Delete this post">
            <DeleteButton postId={post.id} />
          </HoverPopup>
        )}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
