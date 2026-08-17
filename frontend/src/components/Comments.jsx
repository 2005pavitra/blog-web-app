import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Comments = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/comments/${blogId}`, {
        withCredentials: true
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  // Add comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/comments/add`, {
        blogId,
        content: newComment
      }, {
        withCredentials: true
      });

      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/comments/update/${commentId}`, {
        content: editContent
      }, {
        withCredentials: true
      });

      setEditingComment(null);
      setEditContent('');
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Error updating comment. Please try again.');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/comments/delete/${commentId}`, {
        withCredentials: true
      });

      fetchComments(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get Avatar initials
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="mt-16 font-sans border-t border-slate-200 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Discussion</h3>
        <span className="bg-slate-100 text-slate-700 py-1 px-3 rounded-full text-sm font-semibold">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>
      
      {/* Add Comment Form */}
      {user ? (
        <div className="flex gap-4 mb-10">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              {getInitials(user.name || user.username)}
            </div>
          </div>
          <form onSubmit={handleAddComment} className="flex-grow">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all shadow-sm">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full p-4 border-none focus:ring-0 resize-none text-slate-800 bg-transparent placeholder-slate-400 outline-none"
                rows="3"
                required
              />
              <div className="bg-slate-50 px-4 py-3 flex justify-end border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Posting...' : 'Respond'}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-10 p-6 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
          <h4 className="text-lg font-semibold text-slate-800 mb-2">Join the conversation</h4>
          <p className="text-slate-600 mb-4">You need to be logged in to leave a comment.</p>
          <Link to="/login" className="inline-block bg-slate-900 text-white px-6 py-2 rounded-full font-medium hover:bg-slate-800 transition-colors">
            Log in
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-4 group">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm border border-slate-200">
                {getInitials(comment.userName)}
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className="font-semibold text-slate-900">{comment.userName}</span>
                  <span className="text-sm text-slate-500 ml-3">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                
                {/* Edit/Delete buttons */}
                {user && (user._id === comment.userId || user.role === 'admin') && (
                  <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingComment(comment._id);
                        setEditContent(comment.content);
                      }}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Delete"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              
              {editingComment === comment._id ? (
                <div className="mt-2 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-4 border-none focus:ring-0 resize-none text-slate-800 bg-transparent outline-none"
                    rows="3"
                  />
                  <div className="bg-slate-50 px-4 py-2 flex justify-end gap-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingComment(null);
                        setEditContent('');
                      }}
                      className="px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed">{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-block p-4 rounded-full bg-slate-50 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No comments yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
