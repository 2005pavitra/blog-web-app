import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeProvider';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Comments = ({ blogId }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
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
    <div className={`mt-16 font-sans border-t pt-12 transition-colors duration-300 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-8">
        <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Discussion</h3>
        <span className={`py-1 px-3 rounded-full text-sm font-semibold ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </span>
      </div>
      
      {/* Add Comment Form */}
      {user ? (
        <div className="flex gap-4 mb-10">
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
              {getInitials(user.name || user.username)}
            </div>
          </div>
          <form onSubmit={handleAddComment} className="flex-grow">
            <div className={`rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts?"
                className={`w-full p-4 border-none focus:ring-0 resize-none bg-transparent outline-none ${isDark ? 'text-slate-100 placeholder-slate-400' : 'text-slate-800 placeholder-slate-400'}`}
                rows="3"
                required
              />
              <div className={`px-4 py-3 flex justify-end border-t ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
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
        <div className={`mb-10 p-6 border rounded-xl shadow-sm text-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Join the conversation</h4>
          <p className={`mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>You need to be logged in to leave a comment.</p>
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${isDark ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {getInitials(comment.userName)}
              </div>
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{comment.userName}</span>
                  <span className={`text-sm ml-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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
                <div className={`mt-2 border rounded-lg overflow-hidden shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`w-full p-4 border-none focus:ring-0 resize-none bg-transparent outline-none ${isDark ? 'text-slate-100 placeholder-slate-400' : 'text-slate-800'}`}
                    rows="3"
                  />
                  <div className={`px-4 py-2 flex justify-end gap-2 border-t ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
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
                <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{comment.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <div className={`inline-block p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isDark ? 'text-slate-500' : 'text-slate-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No comments yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
};

export default Comments;
