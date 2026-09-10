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
  
  const [requests, setRequests] = useState([]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isRegistering) {
        await axios.post(`${API_URL}/register`, { email, password, role: selectedRole });
        setMessage('Registration successful! Please log in.');
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
  };

  useEffect(() => {
    if (token && role === 'Alumni') {
      fetchAlumniRequests();
    }
  }, [token, role]);

  const fetchAlumniRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/connection-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
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

  if (!token) {
    return (
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">{isRegistering ? 'Register' : 'Login'}</h2>
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
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100 mb-2">{isRegistering ? 'Register' : 'Login'}</button>
          <button type="button" className="btn btn-link w-100" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard ({role})</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

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
          <h4>Student Dashboard</h4>
          <p className="text-muted">You are logged in as a student. Ready to connect with alumni!</p>
        </div>
      )}
    </div>
  );
}