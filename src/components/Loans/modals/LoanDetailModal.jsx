import { useEffect } from 'react';
import './LoanDetailModal.css';

const LoanDetailModal = ({ loan, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (estado) => {
    const statusMap = {
      SOLICITADO: 'status-solicitado',
      ENTREGADO: 'status-entregado',
      DEVUELTO: 'status-devuelto',
    };
    return statusMap[estado] || 'status-default';
  };

  if (!isOpen || !loan) {
    return null;
  }

  return (
    <div className="detail-modal-overlay" onClick={handleBackdropClick}>
      <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="detail-modal-header">
          <h3>Detalles del Préstamo</h3>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="detail-modal-body">
          <div className="detail-section">
            <h4>Información del Solicitante</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{loan.solicitante}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">DNI:</span>
                <span className="detail-value">{loan.dniSolicitante || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Correo:</span>
                <span className="detail-value">{loan.correo}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Información del Préstamo</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Equipo:</span>
                <span className="detail-value equipment-name">{loan.equipo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Código del Equipo:</span>
                <span className="detail-value">{loan.equipoCode || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha del Préstamo:</span>
                <span className="detail-value">{(loan.fecha_prestamo)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estado:</span>
                <span className={`status-badge ${getStatusBadgeClass(loan.estado)}`}>
                  {loan.estado}
                </span>
              </div>
            </div>
          </div>

          {loan.comentario && (
            <div className="detail-section">
              <h4>Comentarios</h4>
              <div className="detail-comment">
                <p>{loan.comentario}</p>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h4>Información Adicional</h4>
            <div className="detail-grid">
              {loan.fecha_creacion && (
                <div className="detail-item">
                  <span className="detail-label">Fecha de Creación:</span>
                  <span className="detail-value">{formatDate(loan.fecha_creacion)}</span>
                </div>
              )}
              {loan.fecha_actualizacion && (
                <div className="detail-item">
                  <span className="detail-label">Última Actualización:</span>
                  <span className="detail-value">{formatDate(loan.fecha_actualizacion)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="detail-modal-footer">
          <button
            className="btn-close-footer"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailModal;
