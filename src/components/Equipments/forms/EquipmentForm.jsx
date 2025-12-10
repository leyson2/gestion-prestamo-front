import { useState } from 'react';
import equipmentService from '../../../services/equipmentService';
import './EquipmentForm.css';

const EquipmentForm = ({ onEquipmentCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del equipo es obligatorio';
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
      const newEquipment = await equipmentService.createEquipment(formData);
      
      setSubmitStatus({
        type: 'success',
        message: 'Equipo registrado exitosamente'
      });

      setFormData({
        nombre: '',
      });
      setErrors({});

      if (onEquipmentCreated) {
        onEquipmentCreated(newEquipment);
      }

      setTimeout(() => {
        setSubmitStatus({ type: '', message: '' });
      }, 3000);

    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Error al registrar el equipo'
      });
      console.error('Error detallado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <h2>Registrar Nuevo Equipo</h2>
      
      {submitStatus.message && (
        <div className={`alert alert-${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="equipment-form" noValidate>
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre del equipo <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            placeholder="Ingrese el nombre del equipo"
            disabled={loading}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar Equipo'}
        </button>
      </form>
    </div>
  );
};

export default EquipmentForm;
