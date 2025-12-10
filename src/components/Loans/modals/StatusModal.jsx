import { useState, useEffect } from 'react';
import loanService from '../../../services/loanService';
import equipmentService from '../../../services/equipmentService';
import './StatusModal.css';

const StatusModal = ({ loan, isOpen, onClose, onStatusUpdated }) => {
  const [mode, setMode] = useState('status'); 
  const [formData, setFormData] = useState({
    solicitante: '',
    dniSolicitante: '',
    correo: '',
    equipoCode: '',
    estado: '',
    fecha_prestamo: '',
    comentario: '',
  });

  const [equipmentList, setEquipmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'SOLICITADO', label: 'Solicitado' },
    { value: 'ENTREGADO', label: 'Entregado' },
    { value: 'DEVUELTO', label: 'Devuelto' },
  ];

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    if (isOpen && loan) {
      setFormData({
        solicitante: loan.solicitante || '',
        dniSolicitante: loan.dniSolicitante || '',
        correo: loan.correo || '',
        equipoCode: loan.equipoCode || '',
        estado: loan.estado || '',
        fecha_prestamo: loan.fecha_prestamo || '',
        comentario: loan.comentario || '',
      });
      setErrors({});
      setMode('status'); 
    }
  }, [isOpen, loan]);

  const loadEquipment = async () => {
    try {
      const equipment = await equipmentService.getSelect();
      setEquipmentList(equipment);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setEquipmentList([]);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
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
  }, [isOpen]);


  const validateForm = () => {
    const newErrors = {};

    if (mode === 'status') {
      // Validar solo estado y comentario
      if (!formData.estado) {
        newErrors.estado = 'Debe seleccionar un estado';
      }

      // Comentario obligatorio solo cuando el estado es DEVUELTO
      if (formData.estado === 'DEVUELTO' && !formData.comentario.trim()) {
        newErrors.comentario = 'El comentario es obligatorio cuando el estado es DEVUELTO';
      }
    } else {
      // Validar todos los campos para actualización completa
      if (!formData.solicitante.trim()) {
        newErrors.solicitante = 'El nombre es obligatorio';
      }

      if (!formData.dniSolicitante.trim()) {
        newErrors.dniSolicitante = 'El DNI es obligatorio';
      }

      if (!formData.correo.trim()) {
        newErrors.correo = 'El correo es obligatorio';
      }

      if (!formData.equipoCode) {
        newErrors.equipoCode = 'Debe seleccionar un equipo';
      }

      if (!formData.estado) {
        newErrors.estado = 'Debe seleccionar un estado';
      }

      if (!formData.fecha_prestamo) {
        newErrors.fecha_prestamo = 'La fecha es obligatoria';
      }

      // Comentario obligatorio solo cuando el estado es DEVUELTO
      if (formData.estado === 'DEVUELTO' && !formData.comentario.trim()) {
        newErrors.comentario = 'El comentario es obligatorio cuando el estado es DEVUELTO';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      let updatedLoan;

      if (mode === 'status') {
        // Solo actualizar estado y comentario
        const updateData = {
          estado: formData.estado,
          comentario: formData.comentario.trim() || '',
        };
        updatedLoan = await loanService.updateLoanStatus(loan.code, updateData);
      } else {
        // Actualizar todos los datos
        const updateData = {
          solicitante: formData.solicitante.trim(),
          dniSolicitante: formData.dniSolicitante.trim(),
          correo: formData.correo.trim(),
          equipoCode: formData.equipoCode,
          estado: formData.estado,
          fecha_prestamo: formData.fecha_prestamo,
          comentario: formData.comentario.trim() || '',
        };
        updatedLoan = await loanService.updateLoan(loan.code, updateData);
      }

      // Notificar al componente padre
      if (onStatusUpdated) {
        onStatusUpdated(updatedLoan);
      }

      handleClose();
    } catch (error) {
      setErrors({
        submit: error.message || 'Error al actualizar el préstamo'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        solicitante: '',
        dniSolicitante: '',
        correo: '',
        equipoCode: '',
        estado: '',
        fecha_prestamo: '',
        comentario: '',
      });
      setErrors({});
      setMode('status');
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen || !loan) {
    return null;
  }

  const commentCharCount = formData.comentario.length;
  const showCommentField = formData.estado === 'DEVUELTO';
  
  // Filtrar opciones de estado para excluir el estado actual del préstamo
  const availableStatusOptions = mode === 'status' 
    ? statusOptions.filter(option => option.value !== loan.estado)
    : statusOptions;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {mode === 'status' ? 'Cambiar Estado del Préstamo' : 'Actualizar Préstamo'}
          </h3>
          <button
            className="btn-close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Botones para cambiar de modo */}
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-btn ${mode === 'status' ? 'active' : ''}`}
              onClick={() => setMode('status')}
              disabled={loading}
            >
              Cambiar Estado
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'full' ? 'active' : ''}`}
              onClick={() => setMode('full')}
              disabled={loading}
            >
              Actualizar Completo
            </button>
          </div>

          {/* Información del préstamo */}
          <div className="loan-info">
            <div className="info-row">
              <span className="info-label">Solicitante:</span>
              <span className="info-value">{loan.solicitante}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Equipo:</span>
              <span className="info-value">{loan.equipo}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Estado actual:</span>
              <span className="info-value status-current">{loan.estado}</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="status-form" noValidate>
            {errors.submit && (
              <div className="alert alert-error">
                {errors.submit}
              </div>
            )}

            {mode === 'full' && (
              <>
                <div className="form-group">
                  <label htmlFor="solicitante">
                    Solicitante <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="solicitante"
                    name="solicitante"
                    value={formData.solicitante}
                    onChange={handleChange}
                    className={errors.solicitante ? 'error' : ''}
                    placeholder="Nombre completo"
                    disabled={loading}
                  />
                  {errors.solicitante && (
                    <span className="error-message">{errors.solicitante}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dniSolicitante">
                    DNI <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="dniSolicitante"
                    name="dniSolicitante"
                    value={formData.dniSolicitante}
                    onChange={handleChange}
                    className={errors.dniSolicitante ? 'error' : ''}
                    placeholder="DNI del solicitante"
                    disabled={loading}
                  />
                  {errors.dniSolicitante && (
                    <span className="error-message">{errors.dniSolicitante}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="correo">
                    Correo <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className={errors.correo ? 'error' : ''}
                    placeholder="ejemplo@correo.com"
                    disabled={loading}
                  />
                  {errors.correo && (
                    <span className="error-message">{errors.correo}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="equipoCode">
                    Equipo <span className="required">*</span>
                  </label>
                  <select
                    id="equipoCode"
                    name="equipoCode"
                    value={formData.equipoCode}
                    onChange={handleChange}
                    className={errors.equipoCode ? 'error' : ''}
                    disabled={loading}
                  >
                    <option value="">Seleccione un equipo</option>
                    {equipmentList.map((equipment) => (
                      <option key={equipment.code} value={equipment.code}>
                        {equipment.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.equipoCode && (
                    <span className="error-message">{errors.equipoCode}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="fecha_prestamo">
                    Fecha del préstamo <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="fecha_prestamo"
                    name="fecha_prestamo"
                    value={formData.fecha_prestamo}
                    onChange={handleChange}
                    className={errors.fecha_prestamo ? 'error' : ''}
                    disabled={loading}
                  />
                  {errors.fecha_prestamo && (
                    <span className="error-message">{errors.fecha_prestamo}</span>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="estado">
                {mode === 'status' ? 'Nuevo estado' : 'Estado'} <span className="required">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={errors.estado ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Seleccione un estado</option>
                {availableStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.estado && (
                <span className="error-message">{errors.estado}</span>
              )}
            </div>

            {showCommentField && (
              <div className="form-group">
                <label htmlFor="comentario">
                  Comentario <span className="required">*</span>
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  className={errors.comentario ? 'error' : ''}
                  placeholder="Describa el estado del equipo devuelto (máx. 500 caracteres)"
                  rows="5"
                  maxLength="500"
                  disabled={loading}
                />
                <div className="char-count">
                  {commentCharCount}/500 caracteres
                </div>
                {errors.comentario && (
                  <span className="error-message">{errors.comentario}</span>
                )}
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-confirm"
                disabled={loading}
              >
                {loading 
                  ? 'Actualizando...' 
                  : mode === 'status' 
                    ? 'Cambiar Estado' 
                    : 'Actualizar Préstamo'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
