import React from "react";
import { Form, Button } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import gql from "graphql-tag";

const PostForm = () => {
  const createPostCallback = () => {
    createPost();
  };
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: ""
  });
  const [createPost, { error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    }
  });
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create new post</h2>
        <Form.Field>
          <Form.Input
            placeholder="Tweets"
            name="body"
            value={values.body}
            onChange={onChange}
            error={error ? true : false}
          />
          <Button type="submit" primary>
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
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
      likeCount
      commentCount
    }
  }
`;

export default PostForm;
