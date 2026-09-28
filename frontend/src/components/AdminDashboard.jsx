import React, { useState } from 'react';

export default function AdminDashboard({
  adminUsers,
  updateUserStatus,
  deleteUser
}) {
  const [showAllHistory, setShowAllHistory] = useState(false);

  // Separate pending requests from already processed users
  const pendingUsers = adminUsers.filter(
    u => u.status === 'Pending'
  );

  const processedUsers = adminUsers.filter(
    u => u.status !== 'Pending'
  );

  // Limit processed users to the latest 3 unless "Show More" is clicked
  const displayedProcessed = showAllHistory
    ? processedUsers
    : processedUsers.slice(0, 3);

  const approvedUsers = adminUsers.filter(
    u => u.status === 'Approved'
  );

  const rejectedUsers = adminUsers.filter(
    u => u.status === 'Rejected'
  );

  return (
    <>
      <style>{`
        .admin-dashboard {
          min-height: 100vh;
          background: #f4f4f6;
          padding: 35px 20px;
        }

        .admin-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Header */
        .admin-header {
          background: #ffffff;
          border-radius: 18px;
          padding: 28px 30px;
          margin-bottom: 25px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border-left: 5px solid #ff7a30;
        }

        .admin-header h2 {
          margin: 0 0 8px;
          color: #111111;
          font-size: 28px;
          font-weight: 700;
        }

        .admin-header p {
          margin: 0;
          color: #777777;
          font-size: 14px;
          line-height: 1.6;
        }

        /* Summary Cards */
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 28px;
        }

        .admin-stat-card {
          background: #ffffff;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .admin-stat-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 100%;
        }

        .admin-stat-card.pending::before {
          background: #ffcc00;
        }

        .admin-stat-card.approved::before {
          background: #7b2cbf;
        }

        .admin-stat-card.rejected::before {
          background: #ff7a30;
        }

        .admin-stat-label {
          color: #777777;
          font-size: 13px;
          margin-bottom: 7px;
        }

        .admin-stat-number {
          color: #111111;
          font-size: 26px;
          font-weight: 700;
        }

        /* Main Sections */
        .admin-section {
          background: #ffffff;
          border-radius: 18px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 7px 25px rgba(0, 0, 0, 0.05);
        }

        .admin-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .admin-section-header h4 {
          margin: 0;
          color: #111111;
          font-size: 19px;
          font-weight: 700;
        }

        .admin-section-description {
          color: #888888;
          font-size: 13px;
          margin-top: 5px;
        }

        /* User Items */
        .admin-user-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 17px 18px;
          border: 1px solid #eeeeee;
          border-radius: 12px;
          background: #fafafa;
          transition: 0.2s ease;
        }

        .admin-user-item:hover {
          border-color: #dddddd;
          transform: translateY(-1px);
        }

        .admin-user-info {
          min-width: 0;
        }

        .admin-user-name {
          color: #111111;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .admin-user-email {
          color: #777777;
          font-size: 13px;
          word-break: break-word;
        }

        .admin-user-role {
          color: #555555;
          font-size: 13px;
          margin-top: 5px;
        }

        /* Badges */
        .admin-status {
          display: inline-block;
          margin-top: 9px;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .admin-status.pending {
          background: #fff4bf;
          color: #7a6100;
        }

        .admin-status.approved {
          background: #eee2fa;
          color: #63219d;
        }

        .admin-status.rejected {
          background: #ffe4d7;
          color: #b94d13;
        }

        /* Action Buttons */
        .admin-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .admin-btn {
          border: none;
          border-radius: 7px;
          padding: 8px 13px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .admin-btn:hover {
          transform: translateY(-1px);
        }

        .admin-btn-approve {
          background: #7b2cbf;
          color: #ffffff;
        }

        .admin-btn-approve:hover {
          background: #6923a5;
        }

        .admin-btn-reject {
          background: #ff7a30;
          color: #ffffff;
        }

        .admin-btn-reject:hover {
          background: #e96822;
        }

        .admin-btn-delete {
          background: #ffffff;
          color: #111111;
          border: 1px solid #dddddd;
        }

        .admin-btn-delete:hover {
          background: #f5f5f5;
        }

        /* Show More */
        .admin-show-more {
          border: 1px solid #7b2cbf;
          background: #ffffff;
          color: #7b2cbf;
          border-radius: 8px;
          padding: 9px 15px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .admin-show-more:hover {
          background: #7b2cbf;
          color: #ffffff;
        }

        /* Empty State */
        .admin-empty {
          text-align: center;
          padding: 30px 15px;
          color: #888888;
          font-size: 14px;
          background: #fafafa;
          border-radius: 10px;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .admin-stats {
            grid-template-columns: 1fr;
          }

          .admin-user-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-actions {
            width: 100%;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 500px) {
          .admin-dashboard {
            padding: 20px 12px;
          }

          .admin-header,
          .admin-section {
            padding: 20px;
          }

          .admin-header h2 {
            font-size: 23px;
          }

          .admin-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .admin-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="admin-dashboard">
        <div className="admin-container">

          {/* Welcome Header */}
          <div className="admin-header">
            <h2>Welcome, Admin 👋</h2>

            <p>
              Manage users, review account requests, and monitor the
              Alumni Student Mentorship platform from here.
            </p>
          </div>

          {/* Statistics */}
          <div className="admin-stats">

            <div className="admin-stat-card pending">
              <div className="admin-stat-label">
                Pending Requests
              </div>

              <div className="admin-stat-number">
                {pendingUsers.length}
              </div>
            </div>

            <div className="admin-stat-card approved">
              <div className="admin-stat-label">
                Approved Users
              </div>

              <div className="admin-stat-number">
                {approvedUsers.length}
              </div>
            </div>

            <div className="admin-stat-card rejected">
              <div className="admin-stat-label">
                Rejected Users
              </div>

              <div className="admin-stat-number">
                {rejectedUsers.length}
              </div>
            </div>

          </div>

          {adminUsers.length === 0 ? (

            <div className="admin-section">
              <div className="admin-empty">
                No users found.
              </div>
            </div>

          ) : (

            <>

              {/* Pending Requests */}
              <div className="admin-section">

                <div className="admin-section-header">
                  <div>
                    <h4>
                      Pending Requests ({pendingUsers.length})
                    </h4>

                    <div className="admin-section-description">
                      Review new student and alumni account requests.
                    </div>
                  </div>
                </div>

                {pendingUsers.length === 0 ? (

                  <div className="admin-empty">
                    No pending requests at the moment.
                  </div>

                ) : (

                  <div className="admin-user-list">

                    {pendingUsers.map(u => (

                      <div
                        key={u._id}
                        className="admin-user-item"
                      >

                        <div className="admin-user-info">

                          <div className="admin-user-name">
                            {u.name}
                          </div>

                          <div className="admin-user-email">
                            {u.email}
                          </div>

                          <div className="admin-user-role">
                            Role: <strong>{u.role}</strong>
                          </div>

                          <span className="admin-status pending">
                            Status: {u.status}
                          </span>

                        </div>

                        <div className="admin-actions">

                          <button
                            className="admin-btn admin-btn-approve"
                            onClick={() =>
                              updateUserStatus(
                                u._id,
                                'Approved'
                              )
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="admin-btn admin-btn-reject"
                            onClick={() =>
                              updateUserStatus(
                                u._id,
                                'Rejected'
                              )
                            }
                          >
                            Reject
                          </button>

      

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

              {/* Processed History */}
              <div className="admin-section">

                <div className="admin-section-header">
                  <div>
                    <h4>
                      Recent Approvals & Rejections
                    </h4>

                    <div className="admin-section-description">
                      View recently processed user accounts.
                    </div>
                  </div>
                </div>

                {processedUsers.length === 0 ? (

                  <div className="admin-empty">
                    No processed history yet.
                  </div>

                ) : (

                  <>

                    <div className="admin-user-list">

                      {displayedProcessed.map(u => (

                        <div
                          key={u._id}
                          className="admin-user-item"
                        >

                          <div className="admin-user-info">

                            <div className="admin-user-name">
                              {u.name}
                            </div>

                            <div className="admin-user-email">
                              {u.email}
                            </div>

                            <div className="admin-user-role">
                              Role: <strong>{u.role}</strong>
                            </div>

                            <span
                              className={`
                                admin-status
                                ${
                                  u.status === 'Approved'
                                    ? 'approved'
                                    : 'rejected'
                                }
                              `}
                            >
                              Status: {u.status}
                            </span>

                          </div>

                        </div>

                      ))}

                    </div>

                    {processedUsers.length > 3 && (

                      <div style={{ marginTop: '18px' }}>

                        <button
                          className="admin-show-more"
                          onClick={() =>
                            setShowAllHistory(!showAllHistory)
                          }
                        >
                          {showAllHistory
                            ? 'Show Less'
                            : `Show More (${processedUsers.length - 3} more)`}
                        </button>

                      </div>

                    )}

                  </>

                )}

              </div>

            </>

          )}

        </div>
      </div>
    </>
  );
}

