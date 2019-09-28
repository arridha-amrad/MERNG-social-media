import React from "react";
import { Popup } from "semantic-ui-react";

const MyPopup = ({ content, children }) => (
  <Popup content={content} trigger={children} />
);

export default MyPopup;
