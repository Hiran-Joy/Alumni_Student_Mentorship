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
  
  // Registration profile states including profilePic
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');

  const [message, setMessage] = useState('');
  
  const [publicAlumni, setPublicAlumni] = useState([]);
  const [requests, setRequests] = useState([]);
  const [alumniList, setAlumniList] = useState([]);
  const [studentRequests, setStudentRequests] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    if (page === 'home') {
      fetchPublicAlumni();
    }
    if (token) {
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
        const payload = {
          name,
          email,
          password,
          role: selectedRole,
          profilePic,
          collegeId: selectedRole === 'Student' ? collegeId : undefined,
          batch: selectedRole === 'Student' ? batch : undefined,
          branch: selectedRole === 'Student' ? branch : undefined,
          company: selectedRole === 'Alumni' ? company : undefined,
          jobTitle: selectedRole === 'Alumni' ? jobTitle : undefined,
          experience: selectedRole === 'Alumni' ? experience : undefined
        };

        const res = await axios.post(`${API_URL}/register`, payload);
        setMessage(res.data.message);
        setPage('login');
      } else {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        setToken(res.data.token);
        setRole(res.data.role);
        setPage('dashboard');
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
    if (!token) {
      alert('Please log in as a student to connect with mentors.');
      setPage('login');
      return;
    }
    if (role === 'Alumni') {
      alert('Alumni accounts cannot send connection requests.');
      return;
    }
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

  // If viewing the public home page
  if (page === 'home') {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
          <a className="navbar-brand" href="#home" onClick={() => setPage('home')}>Alumni Platform</a>
          <div className="navbar-nav ms-auto">
            <button className="btn btn-link nav-link text-white" onClick={() => setPage('home')}>Home</button>
            {token ? (
              <>
                <button className="btn btn-link nav-link text-white" onClick={() => setPage('dashboard')}>Dashboard</button>
                <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn btn-link nav-link text-white" onClick={() => setPage('login')}>Login</button>
                <button className="btn btn-link nav-link text-white" onClick={() => setPage('register')}>Register</button>
              </>
            )}
          </div>
        </nav>
        <Home 
          publicAlumni={publicAlumni} 
          page={page} 
          setPage={setPage} 
          sendConnectionRequest={sendConnectionRequest} 
        />
      </div>
    );
  }

  // If viewing authentication pages
  if (!token || page === 'login' || page === 'register') {
    if (page !== 'login' && page !== 'register') {
      // default to login if no token and not home
    } else {
      return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
            <a className="navbar-brand" href="#home" onClick={() => setPage('home')}>Alumni Platform</a>
            <div className="navbar-nav ms-auto">
              <button className="btn btn-link nav-link text-white" onClick={() => setPage('home')}>Home</button>
              <button className="btn btn-link nav-link text-white" onClick={() => setPage('login')}>Login</button>
              <button className="btn btn-link nav-link text-white" onClick={() => setPage('register')}>Register</button>
            </div>
          </nav>
          <AuthForm 
            page={page} 
            setPage={setPage} 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword} 
            selectedRole={selectedRole} 
            setSelectedRole={setSelectedRole} 
            name={name}
            setName={setName}
            profilePic={profilePic}
            setProfilePic={setProfilePic}
            collegeId={collegeId}
            setCollegeId={setCollegeId}
            batch={batch}
            setBatch={setBatch}
            branch={branch}
            setBranch={setBranch}
            company={company}
            setCompany={setCompany}
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            experience={experience}
            setExperience={setExperience}
            message={message} 
            handleAuth={handleAuth} 
          />
        </div>
      );
    }
  }

  // Logged-in Dashboard View
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 mb-4">
        <a className="navbar-brand" href="#home" onClick={() => setPage('home')}>Alumni Platform</a>
        <div className="navbar-nav ms-auto">
          <button className="btn btn-link nav-link text-white" onClick={() => setPage('home')}>Explore Home</button>
          <button className="btn btn-link nav-link text-white active" onClick={() => setPage('dashboard')}>Dashboard</button>
          <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Dashboard ({role})</h2>
        </div>

        {role === 'Admin' && <AdminDashboard adminUsers={adminUsers} updateUserStatus={updateUserStatus} />}
        {role === 'Alumni' && <AlumniDashboard requests={requests} updateRequestStatus={updateRequestStatus} />}
        {role === 'Student' && <StudentDashboard alumniList={alumniList} studentRequests={studentRequests} sendConnectionRequest={sendConnectionRequest} />}
      </div>
    </div>
  );
}