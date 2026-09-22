import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

const API_URL = 'http://localhost:5000/api';

export default function StudentDashboard({ studentRequests }) {
  const [activeChat, setActiveChat] = useState(null); // { id, name }
  const currentUserId = localStorage.getItem('token');
  const token = localStorage.getItem('token');

  // UI Toggle for Edit Menu
  const [isEditing, setIsEditing] = useState(false);

  // Student Profile View & Edit States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [previewPic, setPreviewPic] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch student profile details
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(res.data.name || '');
      setEmail(res.data.email || '');
      setCollegeId(res.data.collegeId || '');
      setBatch(res.data.batch || '');
      setBranch(res.data.branch || '');
      setProfilePic(res.data.profilePic || '');
      setPreviewPic(res.data.profilePic || '');
      setMessage('');
    } catch (err) {
      console.error('Failed to load profile data', err);
      setMessage(err.response?.data?.message || 'Could not load profile details.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const toggleEditMenu = () => {
    if (!isEditing) {
      fetchProfile();
    }
    setIsEditing(!isEditing);
    setMessage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setPreviewPic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const payload = {
        branch,
        profilePic
      };

      const res = await axios.put(`${API_URL}/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Student Dashboard</h3>
        <button 
          className="btn btn-outline-dark btn-sm"
          onClick={toggleEditMenu}
        >
          {isEditing ? 'Close Edit Menu' : 'View & Edit Profile'}
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {/* Collapsible View & Edit Profile Menu */}
      {isEditing && (
        <div className="card shadow-sm p-4 mb-5" style={{ maxWidth: '600px' }}>
          <h4 className="mb-3">Student Profile Details</h4>
          <form onSubmit={handleUpdateProfile}>
            
            {/* Profile Picture Preview */}
            <div className="mb-3 text-center">
              {previewPic ? (
                <img 
                  src={previewPic} 
                  alt="Profile Preview" 
                  className="rounded-circle mb-2" 
                  style={{ width: '90px', height: '90px', objectFit: 'cover' }} 
                />
              ) : (
                <div 
                  className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto mb-2" 
                  style={{ width: '90px', height: '90px', fontSize: '28px' }}
                >
                  {name ? name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <br />
              <label className="form-label small text-muted">Change Profile Picture</label>
              <input 
                type="file" 
                className="form-control" 
                accept="image/*"
                onChange={handleImageUpload} 
              />
            </div>

            {/* Read-Only Details */}
            <div className="mb-3">
              <label className="form-label text-muted">Name (Fixed)</label>
              <input type="text" className="form-control bg-light" value={name} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Email Address (Fixed)</label>
              <input type="email" className="form-control bg-light" value={email} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">College ID (Fixed)</label>
              <input type="text" className="form-control bg-light" value={collegeId} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Batch (Fixed)</label>
              <input type="text" className="form-control bg-light" value={batch} disabled />
            </div>

            {/* Editable Branch */}
            <div className="mb-3">
              <label className="form-label">Branch / Department</label>
              <input 
                type="text" 
                className="form-control" 
                value={branch} 
                onChange={e => setBranch(e.target.value)} 
                placeholder="e.g. Computer Science & Engineering"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      <h4>My Connection Requests</h4>
      {studentRequests.length === 0 ? <p>You haven't sent any connection requests yet.</p> : (
        <ul className="list-group mb-4">
          {studentRequests.map(req => (
            <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Alumni:</strong> {req.alumni?.email || req.alumni?.name} <br />
              </div>
              <div className="d-flex align-items-center">
                <span className={`badge me-3 ${req.status === 'Accepted' ? 'bg-success' : req.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  {req.status}
                </span>
                {req.status === 'Accepted' && (
                  <button 
                    className="btn btn-sm btn-dark"
                    onClick={() => {
                      if (activeChat?.id === req.alumni._id) {
                        setActiveChat(null);
                      } else {
                        setActiveChat({ id: req.alumni._id, name: req.alumni.name || req.alumni.email });
                      }
                    }}
                  >
                    {activeChat?.id === req.alumni._id ? 'Close Chat' : 'Open Chat'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeChat && (
        <ChatBox 
          currentUserId={currentUserId} 
          recipientId={activeChat.id} 
          recipientName={activeChat.name} 
          token={token} 
        />
      )}
    </div>
  );
}