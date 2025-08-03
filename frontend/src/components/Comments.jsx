import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import axios from 'axios';

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
      const response = await axios.get(`https://blog-web-app-rwce.onrender.com/api/comments/${blogId}`);
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
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/comments/add', {
        blogId,
        content: newComment
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/comments/update/${commentId}`, {
        content: editContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/comments/delete/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Comments ({comments.length})</h3>
      
      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-600">Please <a href="/login" className="text-blue-500 hover:underline">login</a> to leave a comment.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold text-gray-800">{comment.userName}</span>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              
              {/* Edit/Delete buttons */}
              {user && (user._id === comment.userId || user.role === 'admin') && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingComment(comment._id);
                      setEditContent(comment.content);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {editingComment === comment._id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="2"
                />
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default Comments; 
