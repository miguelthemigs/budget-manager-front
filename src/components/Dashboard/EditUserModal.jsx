import React from "react";
import "./EditUserModal.css"; // For styling

const EditUserModal = ({ children, onSave, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
