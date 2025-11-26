import React, { useState } from "react";

const ReplyComponent = ({ postId, onReply }) => {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (replyText.trim() === "") return;
    onReply(postId, replyText);
    setReplyText(""); 
  };

  return (
    <div className="reply-section">
      <input 
        type="text" 
        placeholder="Write a reply..." 
        value={replyText} 
        onChange={(e) => setReplyText(e.target.value)} 
      />
      <button className="post-action" onClick={handleSubmit}>
        Submit Reply
      </button>
    </div>
  );
};

export default ReplyComponent;
