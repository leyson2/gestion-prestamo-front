import { useState, useEffect } from 'react';
import loanService from '../../../services/loanService';
import equipmentService from '../../../services/equipmentService';

import './LoanForm.css';

const LoanForm = ({ onLoanCreated }) => {
  const [formData, setFormData] = useState({
    solicitante: '',
    dniSolicitante: '',
    correo: '',
    equipoCode: '',
    estado: 'SOLICITADO',
    fecha_prestamo: new Date().toISOString().split('T')[0],
    comentario: '',
  });

  const [equipmentList, setEquipmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const equipment = await equipmentService.getSelect();
      setEquipmentList(equipment);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setEquipmentList([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar solicitante
    if (!formData.solicitante.trim()) {
      newErrors.solicitante = 'El nombre es obligatorio';
    }  

    // Validar DNI
    if (!formData.dniSolicitante.trim()) {
      newErrors.dniSolicitante = 'El DNI es obligatorio';
    }

    // Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } 

    // Validar equipoCode
    if (!formData.equipoCode) {
      newErrors.equipoCode = 'Debe seleccionar un equipo';
    }

    // Validar fecha
    if (!formData.fecha_prestamo) {
      newErrors.fecha_prestamo = 'La fecha es obligatoria';
    } else {
      const selectedDate = formData.fecha_prestamo; // formato 'YYYY-MM-DD'
      const today = new Date().toISOString().split('T')[0]; // formato 'YYYY-MM-DD'
      
      if (selectedDate < today) {
        newErrors.fecha_prestamo = 'La fecha no puede ser anterior a hoy';
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

    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Por favor corrija los errores en el formulario'
      });
      return;
    }

    setLoading(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const newLoan = await loanService.createLoan(formData);
      
      setSubmitStatus({
        type: 'success',
        message: 'Préstamo registrado exitosamente'
      });

      setFormData({
        solicitante: '',
        dniSolicitante: '',
        correo: '',
        equipoCode: '',
        estado: 'SOLICITADO',
        fecha_prestamo: new Date().toISOString().split('T')[0],
        comentario: '',
      });
      setErrors({});

      // Notificar al componente padre
      if (onLoanCreated) {
        onLoanCreated(newLoan);
      }

      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 3000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Error al registrar el préstamo'
      });
      console.error('Error detallado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-form-container">
      <h2>Registrar Nuevo Préstamo</h2>
      
      {submitStatus.message && (
        <div className={`alert alert-${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="loan-form" noValidate>

        <div className="form-group">
          <label htmlFor="solicitante">
            Nombre del solicitante <span className="required">*</span>
          </label>
          <input
            type="text"
            id="solicitante"
            name="solicitante"
            value={formData.solicitante}
            onChange={handleChange}
            className={errors.solicitante ? 'error' : ''}
            placeholder="Ingrese el nombre completo"
            disabled={loading}
          />
          {errors.solicitante && <span className="error-message">{errors.solicitante}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dniSolicitante">
            DNI del solicitante <span className="required">*</span>
          </label>
          <input
            type="text"
            id="dniSolicitante"
            name="dniSolicitante"
            value={formData.dniSolicitante}
            onChange={handleChange}
            className={errors.dniSolicitante ? 'error' : ''}
            placeholder="Ingrese el DNI"
            disabled={loading}
          />
          {errors.dniSolicitante && <span className="error-message">{errors.dniSolicitante}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="correo">
            Correo electrónico <span className="required">*</span>
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
          {errors.correo && <span className="error-message">{errors.correo}</span>}
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
          {errors.equipoCode && <span className="error-message">{errors.equipoCode}</span>}
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
          {errors.fecha_prestamo && <span className="error-message">{errors.fecha_prestamo}</span>}
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Préstamo'}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;
