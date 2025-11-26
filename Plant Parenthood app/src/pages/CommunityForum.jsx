import React, { act, useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import NewPost from '../components/NewPost';

const FaHeart = () => '❤️';
const FaRegHeart = () => '♡';
const FaEdit = () => '✏️';
const FaTrash = () => '🗑️';
const FaBookmark = () => '📌';
import ReplyComponent from "../components/Reply";
import { useUser } from '../context/UserContext';


const CommunityForum = () => {
   const { user } = useUser();
   const [showModal, setShowModal] = useState(false);
   const [activeTab, setActiveTab] = useState('popular');
   const [savedPosts, setSavedPosts] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [posts, setPosts] = useState([
     {
       id: 1,
       author: 'greenthumb3000',
       title: 'Pest Control',
       content: 'Has anyone experimented with companion planting in raised beds for pest control? I\'m currently pairing nasturtiums with squash to deter aphids, and I\'ve seen mixed results. Also curious if anyone\'s tried interplanting chives or garlic with tomatoes for fungal resistance. Would love to hear what combinations have actually worked for folks in the PNW climate — especially in wetter springs like this one.',
       date: new Date().toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric'
       }),
       likes: 60,
       tags: ['pests', 'gardening'],
       replies: [],
       edited: false
     },
     {
       id: 2,
       author: 'plantlover42',
       title: 'Indoor Plant Lighting',
       content: 'What are your favorite grow lights for indoor plants during winter months?',
       date: 'April 14, 2025',
       likes: 34,
       tags: ['indoor-plants', 'lighting'],
       replies: [],
       edited: false
     },
     {
       id: 3,
       author: user.username,
       title: 'Looking for humidifiers',
       content: 'Can anyone recommend me a good humidifier to keep in the living room?',
       date: new Date().toLocaleTimeString('en-us'),
       likes: 4,
       tags: ['indoor-plants', 'humidifiers'],
       replies: [],
       edited: false
     }
   ]);


   useEffect(() => {
     try {
       const saved = localStorage.getItem('savedPosts');
       if (saved) {
         const parsed = JSON.parse(saved);
         if (Array.isArray(parsed)) {
           setSavedPosts(parsed);
         }
       }
     } catch (error) {
       console.error('Failed to parse savedPosts from localStorage:', error);
       localStorage.removeItem('savedPosts');
     }
   }, []);


   useEffect(() => {
     try {
       localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
     } catch (error) {
       console.error('Failed to save posts to localStorage:', error);
     }
   }, [savedPosts]);


   const [editingPost, setEditingPost] = useState(null);
   const [editingReply, setEditingReply] = useState({ postId: null, replyIndex: null});
   const [editFormData, setEditFormData] = useState({
     title: '',
     content: '',
     tags: '',
     replyText: ''
   });


   const handleError = (error, message) => {
     // Log error for debugging but don't show to user
     // alert(message);
   };

   const handleNewSubmitPost = (postData) => {
     try {
       const newPost = {
         id: Date.now(),
         author: user.username,
         title: postData.title,
         content: postData.content,
         date: new Date().toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric'
         }),
         likes: 0,
         tags: postData.tags ?
           postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
         replies: [],
         isLiked: false,
         edited: false
       };
       setPosts([newPost, ...posts]);
       setShowModal(false);
     } catch (error) {
       handleError(error, 'Failed to create post. Please try again.');
     }
   };


   const handleLike = (postId) => {
     setPosts(posts.map(post =>
       post.id === postId ? {
         ...post,
         likes: post.likes + (post.isLiked ? -1 : 1),
         isLiked: !post.isLiked
       } : post
     ));
   };


   const handleSavePost = (postId) => {
     try {
       setSavedPosts(prev =>
         prev.includes(postId)
         ? prev.filter(id => id !== postId)
         : [...prev, postId]
       );
     } catch (error) {
       handleError(error, 'Failed to save post. Please try again.');
     }
   };


   const handleReply = (postId, replyText) => {
     if (replyText.trim() === "") return;
     setPosts(prevPosts =>
       prevPosts.map(post =>
       post.id === postId
         ? { ...post,
           replies: [...post.replies, {
             text: replyText,
             author: user.username,
             date: new Date().toLocaleString(),
             edited: false
           }]
         }
       : post
     ));
   };


   const handleDeleteReply = (postId, replyIndex) => {
     if (window.confirm("Are you sure you want to delete this reply?")) {
       setPosts(posts.map(post => {
         if (post.id === postId) {
           const updatedReplies = [...post.replies];
           updatedReplies.splice(replyIndex, 1);
           return { ...post, replies: updatedReplies };
         }
         return post;
       }));
     }
   };


   const handleDeletePost = (postId) => {
     if (window.confirm("Are you sure you want to delete this post?")) {
       setPosts(posts.filter(post => post.id !== postId));
     }
   };
    const handleEditPost = (post) => {
     setEditingPost(post.id);
     setEditFormData({
       ...editFormData,
       title: post.title,
       content: post.content,
       tags: post.tags.join(', ')
     });
   };


   const handleUpdatePost = (postId) => {
     setPosts(posts.map(post =>
       post.id === editingPost
         ? {
             ...post,
             title: editFormData.title,
             content: editFormData.content,
             tags: editFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
             edited: true
           }
         : post
     ));
     setEditingPost(null);
   };


   const handleEditReply = (postId, replyIndex) => {
     setEditingReply({ postId, replyIndex });
     const reply = posts.find(p => p.id === postId)?.replies[replyIndex];
     if (reply) {
       setEditFormData({
         ...editFormData,
         replyText: reply.text
       });
     }
   };


   const handleUpdateReply = () => {
     setPosts(posts.map(post => {
       if (post.id === editingReply.postId) {
         const updatedReplies = [...post.replies];
         updatedReplies[editingReply.replyIndex] = {
           ...updatedReplies[editingReply.replyIndex],
           text: editFormData.replyText,
           edited: true
         };
         return { ...post, replies: updatedReplies };
       }
       return post;
     }));
     setEditingReply({ postId: null, replyIndex: null });
   };


   const handleCancelEdit = () => {
     setEditingPost(null);
     setEditingReply({ postId: null, replyIndex: null });
   };


   const handleSearch = (query) => {
     setSearchQuery(query);
   };


   const getFilteredPosts = () => {
     let filtered = posts;

     // Apply search filter if there's a search query
     if (searchQuery) {
       const query = searchQuery.toLowerCase();
       filtered = filtered.filter(post => 
         post.title.toLowerCase().includes(query) ||
         post.author.toLowerCase().includes(query) ||
         post.tags.some(tag => tag.toLowerCase().includes(query.replace('#', '')))
       );
     }

     // Apply tab filters
     switch(activeTab) {
       case 'myPosts':
         return filtered.filter(post => post.author === user.username);
       case 'liked':
         return filtered.filter(post => post.isLiked);
       case 'saved':
         return filtered.filter(post => savedPosts.includes(post.id));
       case 'popular':
         return [...filtered].sort((a, b) => b.likes - a.likes);
       default:
         return filtered;
     }
   };

   const handleFilterClick = (tab) => {
     setActiveTab(tab);
   };

   const handleNewPostClick = () => {
     setShowModal(true);
   };

   return (
     <>
     <NavBar />
     <SearchBar onSearch={handleSearch} />
  
     <nav className="filter-nav" style={{
       display: 'flex',
       justifyContent: 'center',
       marginBottom: '30px',
       gap: '15px',
       padding: '10px'
     }}>
       <button
         className={`filter-option ${activeTab === 'popular' ? 'active' : ''}`}
         onClick={() => handleFilterClick('popular')}
         style={{
           cursor: 'pointer',
           padding: '10px 20px',
           borderRadius: '20px',
           transition: 'all 0.2s',
           backgroundColor: activeTab === 'popular' ? '#4a6b57' : '#f5f5f5',
           color: activeTab === 'popular' ? 'white' : '#333',
           border: '1px solid #4a6b57',
           fontSize: '16px',
           fontWeight: '700',
           minWidth: '100px',
           outline: 'none',
           textAlign: 'center',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           ':hover': {
             backgroundColor: activeTab === 'popular' ? '#3d5a4a' : '#e8e8e8'
           }
         }}
         aria-pressed={activeTab === 'popular'}
         role="tab"
       >
         Popular
       </button>
       <button
         className={`filter-option ${activeTab === 'myPosts' ? 'active' : ''}`}
         onClick={() => handleFilterClick('myPosts')}
         style={{
           cursor: 'pointer',
           padding: '10px 20px',
           borderRadius: '20px',
           transition: 'all 0.2s',
           backgroundColor: activeTab === 'myPosts' ? '#4a6b57' : '#f5f5f5',
           color: activeTab === 'myPosts' ? 'white' : '#333',
           border: '1px solid #4a6b57',
           fontSize: '16px',
           fontWeight: '700',
           minWidth: '100px',
           outline: 'none',
           textAlign: 'center',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           ':hover': {
             backgroundColor: activeTab === 'myPosts' ? '#3d5a4a' : '#e8e8e8'
           }
         }}
         aria-pressed={activeTab === 'myPosts'}
         role="tab"
       >
         My Posts
       </button>
       <button
         className={`filter-option ${activeTab === 'liked' ? 'active' : ''}`}
         onClick={() => handleFilterClick('liked')}
         style={{
           cursor: 'pointer',
           padding: '10px 20px',
           borderRadius: '20px',
           transition: 'all 0.2s',
           backgroundColor: activeTab === 'liked' ? '#4a6b57' : '#f5f5f5',
           color: activeTab === 'liked' ? 'white' : '#333',
           border: '1px solid #4a6b57',
           fontSize: '16px',
           fontWeight: '700',
           minWidth: '100px',
           outline: 'none',
           textAlign: 'center',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           ':hover': {
             backgroundColor: activeTab === 'liked' ? '#3d5a4a' : '#e8e8e8'
           }
         }}
         aria-pressed={activeTab === 'liked'}
         role="tab"
       >
         Liked
       </button>
       <button
         className={`filter-option ${activeTab === 'saved' ? 'active' : ''}`}
         onClick={() => handleFilterClick('saved')}
         style={{
           cursor: 'pointer',
           padding: '10px 20px',
           borderRadius: '20px',
           transition: 'all 0.2s',
           backgroundColor: activeTab === 'saved' ? '#4a6b57' : '#f5f5f5',
           color: activeTab === 'saved' ? 'white' : '#333',
           border: '1px solid #4a6b57',
           fontSize: '16px',
           fontWeight: '700',
           minWidth: '100px',
           outline: 'none',
           textAlign: 'center',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           ':hover': {
             backgroundColor: activeTab === 'saved' ? '#3d5a4a' : '#e8e8e8'
           }
         }}
         aria-pressed={activeTab === 'saved'}
         role="tab"
       >
         Saved
       </button>
     </nav>
     <div className="container">
       <div className="forum-section">
         <div className="forum-header">
           <h2>Community Plant Forum</h2>
           <p>Welcome to Plant Talk! A community of plant lovers sharing stories, advice, and everything in between to help each other grow thriving gardens.</p>


           <button
             className="new-post-button"
             onClick={handleNewPostClick}
             aria-label="Create new post"
           >
             New Post
           </button>
         </div>
         {showModal && (
           <NewPost
             onSubmit={handleNewSubmitPost}
             onClose={() => setShowModal(false)}
             />
         )}
       </div>

       <div className="posts-list">
         {getFilteredPosts().map(post => (
           <div
           key={post.id}
           className="post">
             <div className="post-header">
               <span className="post-author">{post.author}</span>
               {post.edited && <span className='edited-badge'>(edited)</span>}

               {post.tags.length > 0 && (
                 <div className="post-tags">
                   {post.tags.map(tag => (
                     <span key={tag} className="tag">#{tag}</span>
                   ))}
                 </div>
               )}
             </div>

             {editingPost === post.id ? (
               <div className='edit-form'>
                 <input
                   type="text"
                   value={editFormData.title}
                   onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                   className='form-input'
                 />
                 <textarea
                   value={editFormData.content}
                   onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                   className='form-textarea'
                 />

                 <input
                   type='text'
                   value={editFormData.tags}
                   onChange={(e) => setEditFormData({...editFormData, tags: e.target.value})}
                   className='form-input'
                 />

                 <div className='form-actions'>
                   <button onClick={handleUpdatePost} className='save-button'>
                     Update
                   </button>


                   <button onClick={handleCancelEdit} className='cancel-button'>
                     Cancel
                   </button>
                   </div>
               </div>
             ) : (

           <> 
             <div className="post-content">
               <h3>{post.title}</h3>
               <p>{post.content}</p>
             </div>
             <p className='post-date'>Posted on {post.date}</p>
           </>
         )}


        {post.replies.length > 0 && (
            <div className="replies-section">
              <h4>Replies ({post.replies.length})</h4>
              {post.replies.map((reply, index) => (
                <div key={index} className="reply">
                  {editingReply.postId === post.id && editingReply.replyIndex === index ? (
                    <div className='edit-reply-form'>
                      <textarea
                        value={editFormData.replyText}
                        onChange={(e) => setEditFormData({...editFormData, replyText: e.target.value})}
                        className='form-textarea'
                      />
                      <div className='form-actions'>
                        <button onClick={handleUpdateReply} className='save-button'>
                          Update
                        </button>
                        <button onClick={handleCancelEdit} className='cancel-button'>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                    </>
                  )}
                  <div className="reply-header">
                    <span className="reply-author">{reply.author}</span>
                    <span className="reply-date">{reply.date} {reply.edited && <span className='edited-badge'> (edited) </span>}
                    </span>
                  </div>
                  <p className="reply-content">{reply.text}</p>
                  {reply.author === user.username && (
                    <div className='reply-actions' style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditReply(post.id, index)}
                        className='action-button'
                        style={{
                          color: '#205624',
                          background: 'none',
                          border: 'none',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(32, 86, 36, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <FaEdit /> Edit
                      </button>


                      <button
                        onClick={() => handleDeleteReply(post.id, index)}
                        className='action-button'
                        style={{
                          color: '#205624',
                          background: 'none',
                          border: 'none',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          borderRadius: '4px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
                          e.currentTarget.style.color = '#dc3545';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'none';
                          e.currentTarget.style.color = '#205624';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}


        <div className="post-actions">
          <ReplyComponent postId={post.id} onReply={handleReply} />


          <button
            className="action-buttons"
            onClick={() => handleLike(post.id)}
            aria-label={post.isLiked ? "Unlike post" : "Like post"}
          >
            {post.isLiked ? <FaHeart /> : <FaRegHeart />} Like ({post.likes})
          </button>


          <button 
            onClick={() => handleSavePost(post.id)} 
            className='action-buttons'
            aria-label={savedPosts.includes(post.id) ? "Unsave post" : "Save post"}
          >
            <FaBookmark />
            {savedPosts.includes(post.id) ? 'Saved' : 'Save'}
          </button>
        
          {post.author === user.username && !editingPost && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleEditPost(post)}
                  className="action-button"
                  style={{
                    color: '#205624',
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(32, 86, 36, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="action-button"
                  style={{
                    color: '#205624',
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(220, 53, 69, 0.1)';
                    e.currentTarget.style.color = '#dc3545';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#205624';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            )}
        </div>
      </div>
    ))}
  </div>
</div>
<Footer/>
</>
 );
};
export default CommunityForum;
