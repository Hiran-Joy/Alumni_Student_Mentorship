import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from './ChatBox';

const API_URL = 'http://localhost:5000/api';

export default function StudentDashboard({ studentRequests }) {
  const [activeChat, setActiveChat] = useState(null);
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

      setMessage(
        err.response?.data?.message ||
        'Could not load profile details.'
      );
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

      const res = await axios.put(
        `${API_URL}/profile`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(res.data.message);
      setIsEditing(false);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = studentRequests.filter(
    req => req.status === 'Pending'
  );

  const acceptedRequests = studentRequests.filter(
    req => req.status === 'Accepted'
  );

  const rejectedRequests = studentRequests.filter(
    req => req.status === 'Rejected'
  );

  return (
    <>
      <style>{`
        .student-dashboard {
          min-height: 100vh;
          background: #f4f4f6;
          padding: 35px 20px;
        }

        .student-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Welcome Section */
        .student-welcome {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px 30px;
          margin-bottom: 25px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border-left: 5px solid #ff7a30;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .student-welcome h2 {
          margin: 0 0 8px;
          color: #111111;
          font-size: 28px;
          font-weight: 700;
        }

        .student-welcome p {
          margin: 0;
          color: #777777;
          font-size: 14px;
          line-height: 1.6;
        }

        .profile-button {
          border: none;
          background: #111111;
          color: #ffffff;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s ease;
        }

        .profile-button:hover {
          background: #333333;
          transform: translateY(-1px);
        }

        /* Statistics */
        .student-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .student-stat-card {
          background: #ffffff;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .student-stat-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
        }

        .student-stat-card.total::before {
          background: #ff7a30;
        }

        .student-stat-card.pending::before {
          background: #ffcc00;
        }

        .student-stat-card.accepted::before {
          background: #7b2cbf;
        }

        .student-stat-label {
          color: #777777;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .student-stat-number {
          color: #111111;
          font-size: 26px;
          font-weight: 700;
        }

        /* Message */
        .student-message {
          padding: 12px 15px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #dddddd;
          color: #555555;
          font-size: 13px;
          margin-bottom: 22px;
        }

        /* Profile Edit */
        .student-profile-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 25px;
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.05);
          max-width: 700px;
        }

        .student-profile-card h4 {
          margin: 0 0 5px;
          color: #111111;
          font-size: 20px;
          font-weight: 700;
        }

        .profile-description {
          color: #888888;
          font-size: 13px;
          margin-bottom: 22px;
        }

        .profile-preview {
          text-align: center;
          margin-bottom: 22px;
        }

        .profile-image {
          width: 90px;
          height: 90px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #ffe4d7;
          margin-bottom: 10px;
        }

        .profile-placeholder {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #ff7a30;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
          font-size: 28px;
          font-weight: 700;
        }

        .profile-preview label {
          display: block;
          color: #777777;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .student-form-group {
          margin-bottom: 17px;
        }

        .student-form-group label {
          display: block;
          color: #444444;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .student-form-group input {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #dddddd;
          border-radius: 8px;
          outline: none;
          font-size: 13px;
          color: #222222;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .student-form-group input:focus {
          border-color: #ff7a30;
          box-shadow: 0 0 0 3px rgba(255, 122, 48, 0.08);
        }

        .student-form-group input:disabled {
          background: #f5f5f5;
          color: #777777;
        }

        .save-profile-button {
          width: 100%;
          border: none;
          border-radius: 8px;
          padding: 12px;
          background: #ff7a30;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .save-profile-button:hover {
          background: #e96822;
        }

        .save-profile-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Requests */
        .student-section {
          background: #ffffff;
          border-radius: 18px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.05);
        }

        .student-section h4 {
          margin: 0 0 5px;
          color: #111111;
          font-size: 19px;
          font-weight: 700;
        }

        .section-description {
          color: #888888;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .request-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .request-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 17px 18px;
          border: 1px solid #eeeeee;
          border-radius: 12px;
          background: #fafafa;
          transition: 0.2s ease;
        }

        .request-item:hover {
          border-color: #dddddd;
          transform: translateY(-1px);
        }

        .request-alumni {
          color: #111111;
          font-size: 14px;
          font-weight: 600;
        }

        .request-email {
          color: #777777;
          font-size: 13px;
          margin-top: 3px;
        }

        .request-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .request-status {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .request-status.pending {
          background: #fff4bf;
          color: #7a6100;
        }

        .request-status.accepted {
          background: #eee2fa;
          color: #63219d;
        }

        .request-status.rejected {
          background: #ffe4d7;
          color: #b94d13;
        }

        .chat-button {
          border: none;
          border-radius: 7px;
          padding: 8px 13px;
          background: #111111;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .chat-button:hover {
          background: #333333;
          transform: translateY(-1px);
        }

        /* Empty State */
        .student-empty {
          text-align: center;
          padding: 30px 15px;
          background: #fafafa;
          border-radius: 10px;
          color: #888888;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .student-welcome {
            flex-direction: column;
            align-items: flex-start;
          }

          .student-stats {
            grid-template-columns: 1fr;
          }

          .request-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .request-right {
            width: 100%;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 500px) {
          .student-dashboard {
            padding: 20px 12px;
          }

          .student-welcome,
          .student-section,
          .student-profile-card {
            padding: 20px;
          }

          .student-welcome h2 {
            font-size: 23px;
          }

          .request-right {
            flex-direction: column;
            align-items: stretch;
          }

          .chat-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="student-dashboard">
        <div className="student-container">

          {/* Welcome Header */}
          <div className="student-welcome">
            <div>
              <h2>
                Welcome, {name || 'Student'} 👋
              </h2>

              <p>
                Discover experienced alumni, build meaningful
                connections, and get guidance for your academic
                and professional journey.
              </p>
            </div>

            <button
              className="profile-button"
              onClick={toggleEditMenu}
            >
              {isEditing
                ? 'Close Edit Menu'
                : 'View & Edit Profile'}
            </button>
          </div>

          {/* Statistics */}
          <div className="student-stats">

            <div className="student-stat-card total">
              <div className="student-stat-label">
                Total Requests
              </div>

              <div className="student-stat-number">
                {studentRequests.length}
              </div>
            </div>

            <div className="student-stat-card pending">
              <div className="student-stat-label">
                Pending Requests
              </div>

              <div className="student-stat-number">
                {pendingRequests.length}
              </div>
            </div>

            <div className="student-stat-card accepted">
              <div className="student-stat-label">
                Active Connections
              </div>

              <div className="student-stat-number">
                {acceptedRequests.length}
              </div>
            </div>

          </div>

          {/* Message */}
          {message && (
            <div className="student-message">
              {message}
            </div>
          )}

          {/* Profile Edit */}
          {isEditing && (
            <div className="student-profile-card">

              <h4>
                Student Profile Details
              </h4>

              <div className="profile-description">
                Keep your profile information updated so alumni
                can better understand your background.
              </div>

              <form onSubmit={handleUpdateProfile}>

                {/* Profile Picture */}
                <div className="profile-preview">

                  {previewPic ? (
                    <img
                      src={previewPic}
                      alt="Profile Preview"
                      className="profile-image"
                    />
                  ) : (
                    <div className="profile-placeholder">
                      {name
                        ? name.charAt(0).toUpperCase()
                        : 'S'}
                    </div>
                  )}

                  <label>
                    Change Profile Picture
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                </div>

                {/* Name */}
                <div className="student-form-group">

                  <label>
                    Name (Fixed)
                  </label>

                  <input
                    type="text"
                    value={name}
                    disabled
                  />

                </div>

                {/* Email */}
                <div className="student-form-group">

                  <label>
                    Email Address (Fixed)
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                  />

                </div>

                {/* College ID */}
                <div className="student-form-group">

                  <label>
                    College ID (Fixed)
                  </label>

                  <input
                    type="text"
                    value={collegeId}
                    disabled
                  />

                </div>

                {/* Batch */}
                <div className="student-form-group">

                  <label>
                    Batch (Fixed)
                  </label>

                  <input
                    type="text"
                    value={batch}
                    disabled
                  />

                </div>

                {/* Branch */}
                <div className="student-form-group">

                  <label>
                    Branch / Department
                  </label>

                  <input
                    type="text"
                    value={branch}
                    onChange={e =>
                      setBranch(e.target.value)
                    }
                    placeholder="e.g. Computer Science & Engineering"
                  />

                </div>

                <button
                  type="submit"
                  className="save-profile-button"
                  disabled={loading}
                >
                  {loading
                    ? 'Saving...'
                    : 'Save Changes'}
                </button>

              </form>

            </div>
          )}

          {/* Connection Requests */}
          <div className="student-section">

            <h4>
              My Connection Requests
            </h4>

            <div className="section-description">
              Track the alumni you have contacted and manage
              your active mentorship connections.
            </div>

            {studentRequests.length === 0 ? (

              <div className="student-empty">
                You haven't sent any connection requests yet.
              </div>

            ) : (

              <div className="request-list">

                {studentRequests.map(req => (

                  <div
                    key={req._id}
                    className="request-item"
                  >

                    <div>

                      <div className="request-alumni">
                        Alumni
                      </div>

                      <div className="request-email">
                        {req.alumni?.email ||
                          req.alumni?.name}
                      </div>

                    </div>

                    <div className="request-right">

                      <span
                        className={`
                          request-status
                          ${
                            req.status === 'Accepted'
                              ? 'accepted'
                              : req.status === 'Rejected'
                                ? 'rejected'
                                : 'pending'
                          }
                        `}
                      >
                        {req.status}
                      </span>

                      {req.status === 'Accepted' && (

                        <button
                          className="chat-button"
                          onClick={() => {

                            if (
                              activeChat?.id ===
                              req.alumni._id
                            ) {
                              setActiveChat(null);
                            } else {
                              setActiveChat({
                                id: req.alumni._id,
                                name:
                                  req.alumni.name ||
                                  req.alumni.email
                              });
                            }

                          }}
                        >
                          {activeChat?.id ===
                          req.alumni._id
                            ? 'Close Chat'
                            : 'Open Chat'}
                        </button>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* Chat */}
          {activeChat && (
            <ChatBox
              currentUserId={currentUserId}
              recipientId={activeChat.id}
              recipientName={activeChat.name}
              token={token}
            />
          )}

        </div>
      </div>
    </>
  );
}

