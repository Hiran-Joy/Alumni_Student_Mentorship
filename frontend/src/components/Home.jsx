import React from 'react';

export default function Home({ publicAlumni, page, setPage }) {
  // Limit to latest 6 alumni for the home page display
  const latestAlumni = publicAlumni.slice(0, 6);

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
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Featured Alumni Mentors</h3>
        <span className="text-muted small">Showing latest {latestAlumni.length} of {publicAlumni.length} approved mentors</span>
      </div>

      {latestAlumni.length === 0 ? (
        <p className="text-muted">No approved alumni available right now.</p>
      ) : (
        <div className="row">
          {latestAlumni.map(a => (
            <div className="col-md-4 mb-4" key={a._id}>
              <div className="card h-100 shadow-sm text-center p-3">
                <div className="d-flex justify-content-center mb-3">
                  {a.profilePic ? (
                    <img 
                      src={a.profilePic} 
                      alt={a.name} 
                      className="rounded-circle" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div 
                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" 
                      style={{ width: '80px', height: '80px', fontSize: '28px' }}
                    >
                      {a.name ? a.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <div className="card-body p-0">
                  <h5 className="card-title fw-bold mb-1">{a.name || 'Alumni'}</h5>
                  <p className="text-muted small mb-2">{a.email}</p>
                  <p className="mb-1"><strong>Company:</strong> {a.company || 'N/A'}</p>
                  <p className="mb-1"><strong>Role:</strong> {a.jobTitle || 'N/A'}</p>
                  <p className="mb-3"><strong>Experience:</strong> {a.experience ? `${a.experience} Years` : 'N/A'}</p>
                  <span className="badge bg-success">Verified Mentor</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}