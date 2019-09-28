import React, { useContext, useRef, useState } from "react";
import {
  Grid,
  Image,
  Card,
  Form,
  Button,
  Icon,
  Label
} from "semantic-ui-react";
import LikeButton from "../components/LikeButton";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import moment from "moment";
import MyPopup from "../util/MyPopup";

const SinglePost = props => {
  // get postId from url
  const postId = props.match.params.postId;
  // get login user
  const { user } = useContext(AuthContext);
  // comment input ref
  const commentInputRef = useRef(null);
  // state comment
  const [comment, setComment] = useState("");
  // ambil post id berdasarkan post id
  const {
    data: { getPost }
  } = useQuery(FETCH_POST_QUERY, {
    variables: { postId }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  });

  const deletePostCallback = () => {
    props.history.push("/");
  };

  let postMarkup;
  if (!getPost) {
    postMarkup = <p>loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Column width={2}>
          <Image src="https://react.semantic-ui.com/images/avatar/large/steve.jpg" />
        </Grid.Column>
        <Grid.Column width={9}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likes, likeCount }} />
              <MyPopup content="comment">
                <Button as="div" labelPosition="right">
                  {user && comments.find(c => c.username === user.username) ? (
                    <Button color="teal">
                      <Icon name="comments" />
                    </Button>
                  ) : (
                    <Button color="blue" basic>
                      <Icon name="comments" />
                    </Button>
                  )}

                  <Label as="a" basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
              </MyPopup>
              {user && user.username === getPost.username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {comments.map(comment => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
        <Grid.Column width={5}>
          {user && (
            <Form>
              <div className="ui action fluid">
                <textarea
                  type="text"
                  placeholder="Comment.."
                  name="comment"
                  value={comment}
                  onChange={event => setComment(event.target.value)}
                  ref={commentInputRef}
                />
                <button
                  type="submit"
                  className="ui button teal"
                  disabled={comment.trim() === ""}
                  onClick={submitComment}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Grid.Column>
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        body
        createdAt
        username
      }
    }
  }
`;

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default SinglePost;
