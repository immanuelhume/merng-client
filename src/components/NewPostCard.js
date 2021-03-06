import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Card, Divider, Form } from "semantic-ui-react";
import { POSTS_QUERY } from "../utils/gqlqueries";
import { useForm } from "../utils/hooks";

const NewPostCard = () => {
  const [fieldInfo, updateFields] = useForm({ postBody: "" });

  const [createPost, { error }] = useMutation(NEW_POST_MUTATION, {
    update(cache, result) {
      const {
        data: { createPost: post },
      } = result;
      const data = cache.readQuery({ query: POSTS_QUERY });
      const newEdge = { cursor: post.id, node: post };
      const newEdges = [newEdge, ...data.posts.edges];
      console.log(newEdges);
      cache.writeQuery({
        query: POSTS_QUERY,
        data: {
          posts: {
            edges: newEdges,
            pageInfo: data.posts.pageInfo,
          },
        },
      });
    },
    onError(err) {
      try {
        console.log(err.graphQLErrors[0]);
      } catch (err) {
        console.log(err);
      }
    },
    variables: { body: fieldInfo.postBody },
  });

  function handleSubmit(e) {
    e.preventDefault();
    createPost();
    fieldInfo.postBody = "";
  }

  return (
    <Card>
      <Card.Content>
        <Card.Header>Say something:</Card.Header>
        <Divider />
        <Form>
          <Form.TextArea
            placeholder="What's on your mind?"
            name="postBody"
            value={fieldInfo.postBody}
            onChange={updateFields}
            required={true}
            error={error ? true : false}
          />
          <Form.Button floated="right" color="teal" onClick={handleSubmit}>
            Post
          </Form.Button>
        </Form>
      </Card.Content>
      {error && (
        <div className="ui error message">{error.graphQLErrors[0].message}</div>
      )}
    </Card>
  );
};

const NEW_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      commentCount
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default NewPostCard;
