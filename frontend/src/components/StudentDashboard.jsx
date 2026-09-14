import React, { useState } from 'react';
import ChatBox from './ChatBox';

export default function StudentDashboard({ alumniList, studentRequests, sendConnectionRequest }) {
  const [activeChat, setActiveChat] = useState(null); // { id, name }
  const currentUserId = localStorage.getItem('token');
  const token = localStorage.getItem('token');

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
        <ul className="list-group mb-4">
          {studentRequests.map(req => (
            <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Alumni:</strong> {req.alumni?.email || req.alumni?.name} <br />
              </div>
              <div className="d-flex align-items-center">
                <span className={`badge me-3 ${req.status === 'Accepted' ? 'bg-success' : req.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  {req.status}
                </span>
                {req.status === 'Accepted' && (
                  <button 
                    className="btn btn-sm btn-dark"
                    onClick={() => setActiveChat({ id: req.alumni._id, name: req.alumni.name || req.alumni.email })}
                  >
                    {activeChat?.id === req.alumni._id ? 'Close Chat' : 'Open Chat'}
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