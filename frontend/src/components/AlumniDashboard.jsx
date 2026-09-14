import React from 'react';

export default function AlumniDashboard({ requests, updateRequestStatus }) {
  return (
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
  );
}