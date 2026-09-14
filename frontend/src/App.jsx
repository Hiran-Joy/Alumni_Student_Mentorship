import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './components/Home';
import AuthForm from './components/AuthForm';
import AdminDashboard from './components/AdminDashboard';
import AlumniDashboard from './components/AlumniDashboard';
import StudentDashboard from './components/StudentDashboard';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [page, setPage] = useState('home');

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
      if (page === 'home') {
        fetchPublicAlumni();
      }
    } else {
      if (role === 'Alumni') fetchAlumniRequests();
      else if (role === 'Student') { fetchAlumniList(); fetchStudentRequests(); }
      else if (role === 'Admin') fetchAdminUsers();
    }
  }, [token, role, page]);

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
      if (page === 'register') {
        const res = await axios.post(`${API_URL}/register`, { email, password, role: selectedRole });
        setMessage(res.data.message);
        setPage('login');
      } else {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        setToken(res.data.token);
        setRole(res.data.role);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setRole('');
    setPage('home');
    setRequests([]);
    setAlumniList([]);
    setStudentRequests([]);
    setAdminUsers([]);
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
    } catch (err) { alert('Failed to update status'); }
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
      alert('Connection request sent!');
      fetchStudentRequests();
    } catch (err) { alert(err.response?.data?.message || 'Failed'); }
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
    } catch (err) { alert('Failed to update status'); }
  };

  if (!token) {
    if (page === 'home') {
      return <Home publicAlumni={publicAlumni} page={page} setPage={setPage} />;
    }
    return (
      <AuthForm 
        page={page} 
        setPage={setPage} 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        selectedRole={selectedRole} 
        setSelectedRole={setSelectedRole} 
        message={message} 
        handleAuth={handleAuth} 
      />
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard ({role})</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {role === 'Admin' && <AdminDashboard adminUsers={adminUsers} updateUserStatus={updateUserStatus} />}
      {role === 'Alumni' && <AlumniDashboard requests={requests} updateRequestStatus={updateRequestStatus} />}
      {role === 'Student' && <StudentDashboard alumniList={alumniList} studentRequests={studentRequests} sendConnectionRequest={sendConnectionRequest} />}
    </div>
  );
}