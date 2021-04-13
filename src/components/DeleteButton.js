import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useState } from "react";
import { Button, Confirm, Popup } from "semantic-ui-react";
import { POSTS_QUERY } from "../utils/gqlqueries";

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
        const data = cache.readQuery({ query: POSTS_QUERY });
        const {
          posts: { pageInfo, edges },
        } = data;
        const newEdges = edges.filter(
          (edge) => edge.node.id !== result.data.deletePost.id
        );
        cache.writeQuery({
          query: POSTS_QUERY,
          data: {
            posts: {
              pageInfo,
              edges: newEdges,
            },
          },
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
    <>
      <Popup
        inverted
        content={commentId ? "Delete this comment" : "Delete this post"}
        trigger={
          <Button
            color="red"
            floated="right"
            basic
            onClick={handleDelete}
            icon="trash"
          ></Button>
        }
      />
      <Confirm
        open={openConfirm}
        header={commentId ? "Delete comment?" : "Delete post?"}
        content="This action cannot be reversed!"
        onCancel={() => setOpenConfirm(false)}
        onConfirm={deletePostOrComment}
        confirmButton="Yes"
        size="tiny"
      />
    </>
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
