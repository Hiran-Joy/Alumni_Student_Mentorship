import React from 'react';

export default function Home({ publicAlumni, page, setPage }) {
  return (
    <div className="container mt-4">
      <nav className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2>Alumni Mentorship Platform</h2>
        <div>
          <button className={`btn btn-sm me-2 ${page === 'home' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPage('home')}>Home</button>
          <button className={`btn btn-sm me-2 ${page === 'login' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPage('login')}>Login</button>
          <button className={`btn btn-sm ${page === 'register' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setPage('register')}>Register</button>
        </div>
      </nav>

      <div className="p-4 mb-4 bg-light rounded">
        <h1>Welcome to the Mentorship Portal</h1>
        <p className="lead">Connect with experienced alumni mentors to guide your academic and professional journey.</p>
      </div>
      
      <h3 className="mb-3">Available Alumni Mentors Directory</h3>
      {publicAlumni.length === 0 ? (
        <p className="text-muted">No approved alumni available right now.</p>
      ) : (
        <ul className="list-group">
          {publicAlumni.map(a => (
            <li key={a._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{a.name || a.email}</strong><br />
                <small className="text-muted">{a.email}</small>
              </div>
              <span className="badge bg-success">Verified Mentor</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}