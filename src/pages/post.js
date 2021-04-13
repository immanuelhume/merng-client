import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import moment from "moment";
import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Comment,
  Container,
  Divider,
  Form,
  Header,
} from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import { FETCH_POST_QUERY } from "../utils/gqlqueries";
import { useForm } from "../utils/hooks";

// TODO sort button
// TODO see more button

const PostPage = (props) => {
  const { postId } = useParams();
  const [fieldInfo, updateFields] = useForm({
    commentBody: "",
  });

  const { auth } = useContext(AuthContext);
  const activeUser = auth ? auth.username : null;

  const [createComment, { error: commentError }] = useMutation(
    CREATE_COMMENT_MUTATION,
    {
      variables: { postId, body: fieldInfo.commentBody },
      onError(err) {
        console.log(JSON.stringify(err, null, 2));
      },
      update() {},
    }
  );

  const { loading: pageLoading, error: pageError, data } = useQuery(
    FETCH_POST_QUERY,
    {
      variables: { id: postId },
    }
  );
  if (pageLoading) {
    return <Header>Loading...</Header>;
  }
  if (pageError) {
    console.log(JSON.stringify(pageError, null, 2));
    return <Header>error!</Header>;
  }
  const { post } = data;

  function handleSubmitComment(e) {
    e.preventDefault();
    createComment();
    fieldInfo.commentBody = "";
  }

  return (
    <Container text>
      {moment(post.createdAt).fromNow()}
      <Header size="large">{post.username}</Header>
      <Divider />
      {/* BUG popup in wrong position */}
      {activeUser === post.username && (
        <DeleteButton
          postId={post.id}
          callback={() => props.history.push("/")}
        />
      )}
      <LikeButton
        likeCount={post.likeCount}
        likes={post.likes}
        postId={postId}
        floated="right"
      />
      {post.body}
      <Comment.Group>
        <Header dividing>Comments</Header>
        <Form reply>
          <Form.Input
            name="commentBody"
            value={fieldInfo.commentBody}
            onChange={updateFields}
            error={commentError ? true : false}
            required={true}
            style={{ height: 60 }}
          />
          {activeUser ? (
            <Button
              content="Comment"
              icon="comment"
              color="teal"
              onClick={handleSubmitComment}
            />
          ) : (
            <Button
              content="Comment"
              icon="comment"
              color="teal"
              as={Link}
              to="/login"
            />
          )}
          {/* BUG commentError is undefined */}
          {commentError && (
            <div className="ui error message">{commentError.message}</div>
          )}
        </Form>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => {
            const { body, username, createdAt } = comment;
            return (
              <Comment>
                <Comment.Content>
                  {activeUser === comment.username && (
                    <DeleteButton commentId={comment.id} postId={post.id} />
                  )}
                  <Comment.Author>{username}</Comment.Author>
                  <Comment.Metadata>
                    {moment(createdAt).fromNow()}
                  </Comment.Metadata>
                  <Comment.Text>{body}</Comment.Text>
                </Comment.Content>
              </Comment>
            );
          })
        ) : (
          <p style={{ marginTop: 12 }}>no comments yet...</p>
        )}
      </Comment.Group>
    </Container>
  );
};

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

export default PostPage;
