import React from 'react';

export default function AuthForm({ page, setPage, email, setEmail, password, setPassword, selectedRole, setSelectedRole, message, handleAuth }) {
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

      <div className="mt-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h3 className="mb-3">{page === 'register' ? 'Create an Account' : 'Login to Your Account'}</h3>
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
          {page === 'register' && (
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                <option value="Student">Student</option>
                <option value="Alumni">Alumni</option>
                {/* <option value="Admin">Admin</option> */}
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100 mb-2">
            {page === 'register' ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}