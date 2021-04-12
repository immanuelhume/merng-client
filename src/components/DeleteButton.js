import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { FETCH_ALL_POSTS_QUERY } from "../utils/gqlqueries";
import HoverPopup from "./HoverPopup";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const MUTATION = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(MUTATION, {
    variables: commentId ? { postId, commentId } : { id: postId },
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
    update(cache, result) {
      if (!commentId) {
        const data = cache.readQuery({ query: FETCH_ALL_POSTS_QUERY });
        const newPosts = data.allPosts.filter(
          (post) => post.id !== result.data.deletePost.id
        );
        cache.writeQuery({
          query: FETCH_ALL_POSTS_QUERY,
          data: { allPosts: newPosts },
        });
        if (callback) {
          callback();
        }
      } else {
        setOpenConfirm(false);
      }
    },
  });
  function handleDelete(e) {
    e.preventDefault();
    setOpenConfirm(true);
  }
  return (
    <HoverPopup
      content={commentId ? "Delete this comment" : "Delete this post"}
    >
      <Button color="red" floated="right" basic onClick={handleDelete}>
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={openConfirm}
        header={commentId ? "Delete comment?" : "Delete post?"}
        content="This action cannot be reversed!"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={deletePostOrComment}
        confirmButton="Yes"
        size="tiny"
      />
    </HoverPopup>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      body
      username
      createdAt
      likeCount
      commentCount
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
`;

export default DeleteButton;
