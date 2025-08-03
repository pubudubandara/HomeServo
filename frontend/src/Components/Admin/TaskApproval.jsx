import React, { useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaDownload, FaFileAlt, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const TaskApproval = ({ pendingTasks, onApprove, onReject }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleApprove = (taskerId) => {
    onApprove(taskerId);
    handleCloseModal();
  };

  const handleReject = (taskerId) => {
    onReject(taskerId);
    handleCloseModal();
  };

  return (
    <div className="task-approvals">
      <div className="section-header">
        <h2>Tasker Approvals</h2>
        <div className="header-actions">
          <span className="pending-count">{pendingTasks.length} pending approvals</span>
          <button className="btn-export">Export List</button>
        </div>
      </div>

      {pendingTasks.length === 0 ? (
        <div className="empty-state">
          <FaFileAlt size={48} />
          <h3>No Pending Approvals</h3>
          <p>All tasker applications have been processed.</p>
        </div>
      ) : (
        <div className="approvals-table">
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Category</th>
                <th>Submitted Date</th>
                <th>Documents</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingTasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <div className="applicant-info">
                      <div className="applicant-avatar">
                        {task.taskerName.charAt(0)}
                      </div>
                      <div>
                        <div className="applicant-name">{task.taskerName}</div>
                        <div className="applicant-email">{task.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{task.category}</span>
                  </td>
                  <td>{task.submittedDate}</td>
                  <td>
                    <span className="documents-count">
                      <FaFileAlt />
                      {task.documents.length} files
                    </span>
                  </td>
                  <td>
                    <span className={`priority ${task.priority || 'normal'}`}>
                      {task.priority || 'Normal'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-view" 
                        onClick={() => handleViewDetails(task)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-approve" 
                        onClick={() => handleApprove(task.taskerId)}
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleReject(task.taskerId)}
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing task details */}
      {showModal && selectedTask && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tasker Application Details</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="applicant-profile">
                <div className="profile-avatar">
                  {selectedTask.taskerName.charAt(0)}
                </div>
                <div className="profile-info">
                  <h4>{selectedTask.taskerName}</h4>
                  <p><FaEnvelope /> {selectedTask.email || 'email@example.com'}</p>
                  <p><FaPhone /> {selectedTask.phone || '+94 77 123 4567'}</p>
                </div>
              </div>

              <div className="application-details">
                <div className="detail-item">
                  <label>Category:</label>
                  <span className="category-badge">{selectedTask.category}</span>
                </div>
                <div className="detail-item">
                  <label>Submitted Date:</label>
                  <span>{selectedTask.submittedDate}</span>
                </div>
                <div className="detail-item">
                  <label>Experience:</label>
                  <span>{selectedTask.experience || '3+ years'}</span>
                </div>
                <div className="detail-item">
                  <label>Location:</label>
                  <span>{selectedTask.location || 'Colombo, Sri Lanka'}</span>
                </div>
              </div>

              <div className="documents-section">
                <h4>Submitted Documents</h4>
                <div className="documents-list">
                  {selectedTask.documents.map((doc, index) => (
                    <div key={index} className="document-item">
                      <FaFileAlt />
                      <span>{doc}</span>
                      <button className="btn-download">
                        <FaDownload />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="skills-section">
                <h4>Skills & Certifications</h4>
                <div className="skills-list">
                  {(selectedTask.skills || ['Professional Cleaning', 'Time Management', 'Customer Service']).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-reject-modal" 
                onClick={() => handleReject(selectedTask.taskerId)}
              >
                <FaTimes /> Reject Application
              </button>
              <button 
                className="btn-approve-modal" 
                onClick={() => handleApprove(selectedTask.taskerId)}
              >
                <FaCheck /> Approve Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskApproval;
