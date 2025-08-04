import React from 'react';
import '../assets/css/ConfirmModal.css';

export default function ConfirmModal({ 
  isOpen, 
  message, 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} aria-modal="true" role="dialog">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn cancel-btn" onClick={onCancel}>Annuler</button>
          <button className="btn confirm-btn" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}
