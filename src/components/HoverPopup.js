import React from 'react';
import { Popup } from 'semantic-ui-react';

const HoverPopup = ({ content, children }) => {
  return <Popup inverted content={content} trigger={<span>{children}</span>} />;
};

export default HoverPopup;
