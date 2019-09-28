/*Jika sebuah post dihapus maka hapus juga coment2nya*/
import React, { useState } from "react";
import { Button, Icon, Modal } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

const DeleteButton = ({ postId, commentId, callback }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const [deletePost] = useMutation(mutation, {
    // update proxy
    update(proxy) {
      // tutup modal
      setDeleteConfirm(false);
      /*apakah ada commentId
      jika tidak ada commentId maka delete post*/
      if (!commentId) {
        /*delete post
        panggil post*/
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        });
        // hapus berdasarkan id
        data.getPosts = data.getPosts.filter(post => post.id !== postId);
        // tulis query
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete Comment" : "Delete Post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setDeleteConfirm(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Modal
        size="tiny"
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
      >
        <Modal.Header>Delete Your Post</Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete this post?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setDeleteConfirm(false)}>
            No
          </Button>
          <Button
            positive
            icon="checkmark"
            labelPosition="right"
            content="Yes"
            onClick={deletePost}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
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

export default DeleteButton;
