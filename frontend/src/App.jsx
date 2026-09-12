import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Student');
  const [message, setMessage] = useState('');
  
  const [publicAlumni, setPublicAlumni] = useState([]);
  const [requests, setRequests] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    if (!token) {
      fetchPublicAlumni();
    } else {
      if (role === 'Alumni') fetchAlumniRequests();
      else if (role === 'Student') { fetchAlumniList(); fetchStudentRequests(); }
      else if (role === 'Admin') fetchAdminUsers();
    }
  }, [token, role]);

  const fetchPublicAlumni = async () => {
    try {
      const res = await axios.get(`${API_URL}/public/alumni`);
      setPublicAlumni(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isRegistering) {
        const res = await axios.post(`${API_URL}/register`, { email, password, role: selectedRole });
        setMessage(res.data.message);
        setIsRegistering(false);
      } else {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        setToken(res.data.token);
        setRole(res.data.role);
        setMessage('Logged in successfully!');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setRole('');
    setRequests([]);
    setAlumniList([]);
    setStudentRequests([]);
    setAdminUsers([]);
    fetchPublicAlumni();
  };

  const fetchAlumniRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/connection-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/connection-request/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAlumniRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const fetchAlumniList = async () => {
    try {
      const res = await axios.get(`${API_URL}/alumni`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlumniList(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStudentRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudentRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const sendConnectionRequest = async (alumniId) => {
    try {
      await axios.post(`${API_URL}/connection-request`, { alumniId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Connection request sent successfully!');
      fetchStudentRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdminUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const updateUserStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/admin/user/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdminUsers();
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  if (!token) {
    return (
      <div className="container mt-4">
        <h2 className="mb-3">Public Alumni Mentors Directory</h2>
        {publicAlumni.length === 0 ? (
          <p className="text-muted">No approved alumni available right now.</p>
        ) : (
          <ul className="list-group mb-5">
            {publicAlumni.map(a => (
              <li key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{a.name || a.email}</strong><br />
                  <small className="text-muted">{a.email}</small>
                </div>
                <span className="badge bg-success">Approved Alumni</span>
              </li>
            ))}
          </ul>
        )}

        <hr />

        <div className="mt-4" style={{ maxWidth: '400px' }}>
          <h3 className="mb-3">{isRegistering ? 'Register' : 'Login'}</h3>
          {message && <div className="alert alert-info">{message}</div>}
          <form onSubmit={handleAuth}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {isRegistering && (
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                  <option value="Student">Student</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 mb-2">{isRegistering ? 'Register' : 'Login'}</button>
            <button type="button" className="btn btn-link w-100" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard ({role})</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {role === 'Admin' && (
        <div>
          <h4>Manage Users (Approve / Reject Accounts)</h4>
          {adminUsers.length === 0 ? <p>No users found.</p> : (
            <ul className="list-group">
              {adminUsers.map(u => (
                <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{u.name}</strong> ({u.email}) - Role: <em>{u.role}</em> <br />
                    <span className={`badge mt-1 ${u.status === 'Approved' ? 'bg-success' : u.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      Status: {u.status}
                    </span>
                  </div>
                  {u.status === 'Pending' && (
                    <div>
                      <button className="btn btn-success btn-sm me-2" onClick={() => updateUserStatus(u._id, 'Approved')}>Approve</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateUserStatus(u._id, 'Rejected')}>Reject</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {role === 'Alumni' && (
        <div>
          <h4>Incoming Connection Requests</h4>
          {requests.length === 0 ? <p>No connection requests found.</p> : (
            <ul className="list-group">
              {requests.map(req => (
                <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Student:</strong> {req.student?.email} <br />
                    <span className="badge bg-secondary">Status: {req.status}</span>
                  </div>
                  {req.status === 'Pending' && (
                    <div>
                      <button className="btn btn-success btn-sm me-2" onClick={() => updateRequestStatus(req._id, 'Accepted')}>Accept</button>
                      <button className="btn btn-danger btn-sm" onClick={() => updateRequestStatus(req._id, 'Rejected')}>Reject</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {role === 'Student' && (
        <div>
          <h4>Available Alumni Mentors</h4>
          {alumniList.length === 0 ? <p>No approved alumni available right now.</p> : (
            <ul className="list-group mb-4">
              {alumniList.map(alumni => (
                <li key={alumni._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{alumni.name || alumni.email}</strong> <br />
                    <small className="text-muted">{alumni.email}</small>
                  </div>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => sendConnectionRequest(alumni._id)}>
                    Connect
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h4>My Connection Requests</h4>
          {studentRequests.length === 0 ? <p>You haven't sent any connection requests yet.</p> : (
            <ul className="list-group">
              {studentRequests.map(req => (
                <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Alumni:</strong> {req.alumni?.email} <br />
                  </div>
                  <span className={`badge ${req.status === 'Accepted' ? 'bg-success' : req.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {req.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}