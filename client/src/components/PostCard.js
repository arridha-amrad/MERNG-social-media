import React, { useContext } from "react";
import { Card, Image, Button, Icon, Label } from "semantic-ui-react";
import moment from "moment";
import LikeButton from "./LikeButton";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";
import MyPopup from "../util/MyPopup";

const PostCard = ({
  post: {
    id,
    body,
    comments,
    username,
    createdAt,
    likeCount,
    commentCount,
    likes
  }
}) => {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="comment">
          <Button as={Link} to={`/posts/${id}`} labelPosition="right">
            {user && comments.find(c => c.username === user.username) ? (
              <Button color="teal">
                <Icon name="comments" />
              </Button>
            ) : (
              <Button color="teal" basic>
                <Icon name="comments" />
              </Button>
            )}
            <Label basic color="teal" pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
