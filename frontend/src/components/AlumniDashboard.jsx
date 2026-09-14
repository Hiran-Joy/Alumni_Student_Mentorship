import React, { useState } from 'react';
import ChatBox from './ChatBox';

export default function AlumniDashboard({ requests, updateRequestStatus }) {
  const [activeChat, setActiveChat] = useState(null); // { id, name }
  const currentUserId = localStorage.getItem('token');
  const token = localStorage.getItem('token');

  return (
    <div>
      <h4>Incoming Connection Requests</h4>
      {requests.length === 0 ? <p>No connection requests found.</p> : (
        <ul className="list-group mb-4">
          {requests.map(req => (
            <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Student:</strong> {req.student?.email || req.student?.name} <br />
                <span className={`badge mt-1 ${req.status === 'Accepted' ? 'bg-success' : req.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                  Status: {req.status}
                </span>
              </div>
              <div className="d-flex align-items-center">
                {req.status === 'Pending' && (
                  <div>
                    <button className="btn btn-success btn-sm me-2" onClick={() => updateRequestStatus(req._id, 'Accepted')}>Accept</button>
                    <button className="btn btn-danger btn-sm" onClick={() => updateRequestStatus(req._id, 'Rejected')}>Reject</button>
                  </div>
                )}
                {req.status === 'Accepted' && (
                  <button 
                    className="btn btn-sm btn-dark ms-2"
                    onClick={() => setActiveChat({ id: req.student._id, name: req.student.name || req.student.email })}
                  >
                    {activeChat?.id === req.student._id ? 'Close Chat' : 'Open Chat'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeChat && (
        <ChatBox 
          currentUserId={currentUserId} 
          recipientId={activeChat.id} 
          recipientName={activeChat.name} 
          token={token} 
        />
      )}
    </div>
  );
}