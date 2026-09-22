import React, { useState } from 'react';

export default function Home({ publicAlumni, sendConnectionRequest }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  // Extract unique companies for the company filter dropdown
  const uniqueCompanies = [...new Set(publicAlumni.map(a => a.company).filter(Boolean))];

  // Filter alumni based on search keyword (name, company, jobTitle) and company dropdown
  const filteredAlumni = publicAlumni.filter(a => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (a.name && a.name.toLowerCase().includes(term)) ||
      (a.company && a.company.toLowerCase().includes(term)) ||
      (a.jobTitle && a.jobTitle.toLowerCase().includes(term));
    
    const matchesCompany = selectedCompany ? a.company === selectedCompany : true;

    return matchesSearch && matchesCompany;
  });

  // If the user is searching or filtering, show all matches. Otherwise, limit to latest 6.
  const isSearching = searchTerm.trim() !== '' || selectedCompany !== '';
  const displayedAlumni = isSearching ? filteredAlumni : publicAlumni.slice(0, 6);

  return (
    <div className="container mt-4">
      <div className="p-4 mb-4 bg-light rounded text-center">
        <h1 className="mb-3">Welcome to the Mentorship Portal</h1>
        <p className="lead mb-4">Connect with experienced alumni mentors to guide your academic and professional journey.</p>
        
        {/* Search & Filter Bar */}
        <div className="row g-3 justify-content-center">
          <div className="col-md-6">
            <input 
              type="text" 
              className="form-control form-control-lg" 
              placeholder="Search by name, role (e.g. Engineer, HR), or company..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select 
              className="form-select form-select-lg" 
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map((comp, idx) => (
                <option key={idx} value={comp}>{comp}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{isSearching ? 'Search Results' : 'Featured Alumni Mentors'}</h3>
        <span className="text-muted small">
          {isSearching 
            ? `Showing ${displayedAlumni.length} matching mentors` 
            : `Showing latest ${displayedAlumni.length} of ${publicAlumni.length} approved mentors`
          }
        </span>
      </div>

      {displayedAlumni.length === 0 ? (
        <p className="text-muted text-center py-4">No approved alumni found matching your search criteria.</p>
      ) : (
        <div className="row">
          {displayedAlumni.map(a => (
            <div className="col-md-4 mb-4" key={a._id}>
              <div className="card h-100 shadow-sm text-center p-3 d-flex flex-column justify-content-between">
                <div>
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
                    <span className="badge bg-success mb-3">Verified Mentor</span>
                  </div>
                </div>
                <div>
                  <button 
                    className="btn btn-outline-primary btn-sm w-100" 
                    onClick={() => sendConnectionRequest(a._id)}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}