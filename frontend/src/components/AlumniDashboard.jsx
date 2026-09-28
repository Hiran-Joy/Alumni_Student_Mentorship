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

      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Could not load profile details.';

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
      setMessage(
        err.response?.data?.message ||
        'Failed to update profile'
      );
    } finally {
      setLoading(false);
    }
  };

  const pendingRequests = requests.filter(
    req => req.status === 'Pending'
  );

  const acceptedRequests = requests.filter(
    req => req.status === 'Accepted'
  );

  return (
    <>
      <style>{`
        .alumni-dashboard {
          min-height: 100vh;
          background: #f4f4f6;
          padding: 35px 20px;
        }

        .alumni-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Welcome Section */
        .alumni-welcome {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px 30px;
          margin-bottom: 25px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border-left: 5px solid #7b2cbf;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .alumni-welcome h2 {
          margin: 0 0 8px;
          color: #111111;
          font-size: 28px;
          font-weight: 700;
        }

        .alumni-welcome p {
          margin: 0;
          color: #777777;
          font-size: 14px;
          line-height: 1.6;
        }

        .profile-button {
          border: 1px solid #111111;
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
        .alumni-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 25px;
        }

        .alumni-stat-card {
          background: #ffffff;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .alumni-stat-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
        }

        .alumni-stat-card.total::before {
          background: #ff7a30;
        }

        .alumni-stat-card.pending::before {
          background: #ffcc00;
        }

        .alumni-stat-card.accepted::before {
          background: #7b2cbf;
        }

        .alumni-stat-label {
          color: #777777;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .alumni-stat-number {
          color: #111111;
          font-size: 26px;
          font-weight: 700;
        }

        /* Message */
        .alumni-message {
          padding: 12px 15px;
          border-radius: 10px;
          background: #ffffff;
          border: 1px solid #dddddd;
          color: #555555;
          font-size: 13px;
          margin-bottom: 22px;
        }

        /* Profile Edit */
        .alumni-profile-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 25px;
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.05);
          max-width: 700px;
        }

        .alumni-profile-card h4 {
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
          border: 3px solid #eee2fa;
          margin-bottom: 10px;
        }

        .profile-placeholder {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          background: #7b2cbf;
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

        .alumni-form-group {
          margin-bottom: 17px;
        }

        .alumni-form-group label {
          display: block;
          color: #444444;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .alumni-form-group input {
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

        .alumni-form-group input:focus {
          border-color: #7b2cbf;
          box-shadow: 0 0 0 3px rgba(123, 44, 191, 0.08);
        }

        .alumni-form-group input:disabled {
          background: #f5f5f5;
          color: #777777;
        }

        .save-profile-button {
          width: 100%;
          border: none;
          border-radius: 8px;
          padding: 12px;
          background: #7b2cbf;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .save-profile-button:hover {
          background: #6923a5;
        }

        .save-profile-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Requests Section */
        .alumni-section {
          background: #ffffff;
          border-radius: 18px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.05);
        }

        .alumni-section h4 {
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

        .request-student {
          color: #111111;
          font-size: 14px;
          font-weight: 600;
        }

        .request-email {
          color: #777777;
          font-size: 13px;
        }

        .request-status {
          display: inline-block;
          margin-top: 8px;
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

        .request-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .request-button {
          border: none;
          border-radius: 7px;
          padding: 8px 13px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .request-button:hover {
          transform: translateY(-1px);
        }

        .accept-button {
          background: #7b2cbf;
          color: #ffffff;
        }

        .accept-button:hover {
          background: #6923a5;
        }

        .reject-button {
          background: #ff7a30;
          color: #ffffff;
        }

        .reject-button:hover {
          background: #e96822;
        }

        .chat-button {
          background: #111111;
          color: #ffffff;
        }

        .chat-button:hover {
          background: #333333;
        }

        /* Empty State */
        .alumni-empty {
          text-align: center;
          padding: 30px 15px;
          background: #fafafa;
          border-radius: 10px;
          color: #888888;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .alumni-welcome {
            flex-direction: column;
            align-items: flex-start;
          }

          .alumni-stats {
            grid-template-columns: 1fr;
          }

          .request-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .request-actions {
            width: 100%;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 500px) {
          .alumni-dashboard {
            padding: 20px 12px;
          }

          .alumni-welcome,
          .alumni-section,
          .alumni-profile-card {
            padding: 20px;
          }

          .alumni-welcome h2 {
            font-size: 23px;
          }

          .request-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .request-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="alumni-dashboard">
        <div className="alumni-container">

          {/* Welcome Header */}
          <div className="alumni-welcome">
            <div>
              <h2>
                Welcome, {name || 'Alumni'} 👋
              </h2>

              <p>
                Share your experience, connect with students,
                and help guide the next generation of professionals.
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
          <div className="alumni-stats">

            <div className="alumni-stat-card total">
              <div className="alumni-stat-label">
                Total Requests
              </div>

              <div className="alumni-stat-number">
                {requests.length}
              </div>
            </div>

            <div className="alumni-stat-card pending">
              <div className="alumni-stat-label">
                Pending Requests
              </div>

              <div className="alumni-stat-number">
                {pendingRequests.length}
              </div>
            </div>

            <div className="alumni-stat-card accepted">
              <div className="alumni-stat-label">
                Connected Students
              </div>

              <div className="alumni-stat-number">
                {acceptedRequests.length}
              </div>
            </div>

          </div>

          {/* Message */}
          {message && (
            <div className="alumni-message">
              {message}
            </div>
          )}

          {/* Profile Edit Menu */}
          {isEditing && (
            <div className="alumni-profile-card">

              <h4>
                {name
                  ? `${name}'s Profile Details`
                  : 'Profile Details'}
              </h4>

              <div className="profile-description">
                Keep your professional information updated so
                students can learn more about you.
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
                        : 'A'}
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
                <div className="alumni-form-group">

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
                <div className="alumni-form-group">

                  <label>
                    Email Address (Fixed)
                  </label>

                  <input
                    type="email"
                    value={email}
                    disabled
                  />

                </div>

                {/* Company */}
                <div className="alumni-form-group">

                  <label>
                    Current Company
                  </label>

                  <input
                    type="text"
                    value={company}
                    onChange={e =>
                      setCompany(e.target.value)
                    }
                    placeholder="e.g. UST Global"
                  />

                </div>

                {/* Job Title */}
                <div className="alumni-form-group">

                  <label>
                    Job Title / Role
                  </label>

                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e =>
                      setJobTitle(e.target.value)
                    }
                    placeholder="e.g. Software Engineer"
                  />

                </div>

                {/* Experience */}
                <div className="alumni-form-group">

                  <label>
                    Years of Experience
                  </label>

                  <input
                    type="text"
                    value={experience}
                    onChange={e =>
                      setExperience(e.target.value)
                    }
                    placeholder="e.g. 3 Years"
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

          {/* Incoming Requests */}
          <div className="alumni-section">

            <h4>
              Incoming Connection Requests
            </h4>

            <div className="section-description">
              Review students who want to connect with you
              for mentorship and guidance.
            </div>

            {requests.length === 0 ? (

              <div className="alumni-empty">
                No connection requests found.
              </div>

            ) : (

              <div className="request-list">

                {requests.map(req => (

                  <div
                    key={req._id}
                    className="request-item"
                  >

                    <div>

                      <div className="request-student">
                        Student
                      </div>

                      <div className="request-email">
                        {req.student?.email ||
                          req.student?.name}
                      </div>

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
                        Status: {req.status}
                      </span>

                    </div>

                    <div className="request-actions">

                      {req.status === 'Pending' && (
                        <>
                          <button
                            className="request-button accept-button"
                            onClick={() =>
                              updateRequestStatus(
                                req._id,
                                'Accepted'
                              )
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="request-button reject-button"
                            onClick={() =>
                              updateRequestStatus(
                                req._id,
                                'Rejected'
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {req.status === 'Accepted' && (
                        <button
                          className="request-button chat-button"
                          onClick={() => {

                            if (
                              activeChat?.id ===
                              req.student._id
                            ) {
                              setActiveChat(null);
                            } else {
                              setActiveChat({
                                id: req.student._id,
                                name:
                                  req.student.name ||
                                  req.student.email
                              });
                            }

                          }}
                        >
                          {activeChat?.id ===
                          req.student._id
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

