import React from 'react';

export default function StudentDashboard({ alumniList, studentRequests, sendConnectionRequest }) {
  return (
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
  );
}