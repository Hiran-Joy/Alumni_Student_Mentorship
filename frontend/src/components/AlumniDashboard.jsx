import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

const API_URL = 'http://localhost:5000/api';

export default function AlumniDashboard({ requests, updateRequestStatus }) {
  const [activeChat, setActiveChat] = useState(null);
  const currentUserId = localStorage.getItem('token');
  const token = localStorage.getItem('token');

  // UI Toggle for Edit Menu
  const [isEditing, setIsEditing] = useState(false);

  // Profile View & Edit States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [previewPic, setPreviewPic] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all of Laura's current data on load / when opening edit menu
  const fetchProfile = async () => {
    try {
      console.log('Sending token to fetch profile:', token);
      const res = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(res.data.name || '');
      setEmail(res.data.email || '');
      setCompany(res.data.company || '');
      setJobTitle(res.data.jobTitle || '');
      setExperience(res.data.experience || '');
      setProfilePic(res.data.profilePic || '');
      setPreviewPic(res.data.profilePic || '');
      setMessage('');
    } catch (err) {
      console.error('Failed to load profile data', err.response || err);
      const errorMsg = err.response?.data?.message || err.message || 'Could not load profile details.';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  // Handle opening/closing the edit menu and refreshing data
  const toggleEditMenu = () => {
    if (!isEditing) {
      fetchProfile();
    }
    setIsEditing(!isEditing);
    setMessage('');
  };

  // Handle local device image selection and conversion to Base64
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
        company,
        jobTitle,
        experience,
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
        <h3>Alumni Dashboard</h3>
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
          <h4 className="mb-3">{name ? `${name}'s Profile Details` : "Profile Details"}</h4>
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
                  {name ? name.charAt(0).toUpperCase() : 'A'}
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

            {/* Read-Only Name & Email */}
            <div className="mb-3">
              <label className="form-label text-muted">Name (Fixed)</label>
              <input 
                type="text" 
                className="form-control bg-light" 
                value={name} 
                disabled 
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted">Email Address (Fixed)</label>
              <input 
                type="email" 
                className="form-control bg-light" 
                value={email} 
                disabled 
              />
            </div>

            {/* Editable Professional Details */}
            <div className="mb-3">
              <label className="form-label">Current Company</label>
              <input 
                type="text" 
                className="form-control" 
                value={company} 
                onChange={e => setCompany(e.target.value)} 
                placeholder="e.g. UST Global"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Job Title / Role</label>
              <input 
                type="text" 
                className="form-control" 
                value={jobTitle} 
                onChange={e => setJobTitle(e.target.value)} 
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Years of Experience</label>
              <input 
                type="text" 
                className="form-control" 
                value={experience} 
                onChange={e => setExperience(e.target.value)} 
                placeholder="e.g. 3 Years"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      <h4 className="mb-3">Incoming Connection Requests</h4>
      {requests.length === 0 ? <p>No connection requests found.</p> : (
        <ul className="list-group mb-4">
          {requests.map(req => (
            <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Student:</strong> {req.student?.email || req.student?.name} <br />
                <span className={`badge mt-1 ${req.status === 'Accepted' ? 'bg-success' : req.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                  Status: {req.status}
                </span>
              </div>
              <div className="d-flex align-items-center">
                {req.status === 'Pending' && (
                  <div>
                    <button className="btn btn-success btn-sm me-2" onClick={() => updateRequestStatus(req._id, 'Accepted')}>Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateRequestStatus(req._id, 'Rejected')}>Reject</button>
                  </div>
                )}
                {req.status === 'Accepted' && (
                  <button 
                    className="btn btn-sm btn-dark ms-2"
                    onClick={() => {
                      if (activeChat?.id === req.student._id) {
                        setActiveChat(null);
                      } else {
                        setActiveChat({ id: req.student._id, name: req.student.name || req.student.email });
                      }
                    }}
                  >
                    {activeChat?.id === req.student._id ? 'Close Chat' : 'Open Chat'}
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