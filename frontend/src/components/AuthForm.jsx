import React from 'react';

export default function AuthForm({ 
  page, 
  setPage, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  selectedRole, 
  setSelectedRole, 
  name, 
  setName, 
  setProfilePic,
  collegeId, 
  setCollegeId, 
  batch, 
  setBatch, 
  branch, 
  setBranch, 
  company, 
  setCompany, 
  jobTitle, 
  setJobTitle, 
  experience, 
  setExperience, 
  message, 
  handleAuth 
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // Converts image to Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '450px' }}>
      <div className="card shadow-sm p-4">
        <h3 className="mb-3 text-center">{page === 'register' ? 'Create an Account' : 'Login to Your Account'}</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleAuth}>
          {page === 'register' && (
            <>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Profile Picture (Optional)</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*"
                  onChange={handleImageUpload} 
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          {page === 'register' && (
            <>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select 
                  className="form-select" 
                  value={selectedRole} 
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              {selectedRole === 'Student' ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">College ID Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={collegeId} 
                      onChange={e => setCollegeId(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Batch / Graduation Year</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={batch} 
                      onChange={e => setBatch(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Branch / Major</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={branch} 
                      onChange={e => setBranch(e.target.value)} 
                      required 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Current Company</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={company} 
                      onChange={e => setCompany(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Job Title / Role</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={jobTitle} 
                      onChange={e => setJobTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Years of Experience</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={experience} 
                      onChange={e => setExperience(e.target.value)} 
                      required 
                    />
                  </div>
                </>
              )}
            </>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-2">
            {page === 'register' ? 'Register' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}