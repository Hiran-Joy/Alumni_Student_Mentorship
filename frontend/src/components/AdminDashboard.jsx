import React from 'react';

export default function AdminDashboard({ adminUsers, updateUserStatus }) {
  return (
    <div>
      <h4>Manage Users (Approve / Reject Accounts)</h4>
      {adminUsers.length === 0 ? <p>No users found.</p> : (
        <ul className="list-group">
          {adminUsers.map(u => (
            <li key={u._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{u.name}</strong> ({u.email}) - Role: <em>{u.role}</em> <br />
                <span className={`badge mt-1 ${u.status === 'Approved' ? 'bg-success' : u.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  Status: {u.status}
                </span>
              </div>
              {u.status === 'Pending' && (
                <div>
                  <button className="btn btn-success btn-sm me-2" onClick={() => updateUserStatus(u._id, 'Approved')}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateUserStatus(u._id, 'Rejected')}>Reject</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}