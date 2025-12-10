const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const handleResponse = async (response) => {
  if (response.status !== 'success') {
    // Si message es un objeto con errores de validación
    if (typeof response.message === 'object') {
      const errorMessages = Object.entries(response.message)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('; ');
      throw new Error(errorMessages || 'Error de validación');
    }
    // Si message es un string
    throw new Error(response.message || response.errors || 'Error en la solicitud');
  }
  return response.data;
};


const loanService = {

  getAllLoans: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prestamos/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error('Error al obtener préstamos:', error);
      throw error;
    }
  },

  getLoanById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prestamos/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error(`Error al obtener préstamo ${id}:`, error);
      throw error;
    }
  },

 
  createLoan: async (loanData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prestamos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData),
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      throw error;
    }
  },

  updateLoan: async (id, loanData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prestamos/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData),
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error(`Error al actualizar préstamo ${id}:`, error);
      throw error;
    }
  },

  updateLoanStatus: async (id, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prestamos/cambiar-estado/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error(`Error al actualizar estado del préstamo ${id}:`, error);
      throw error;
    }
  },

  
  deleteLoan: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prestamos/${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error(`Error al eliminar préstamo ${id}:`, error);
      throw error;
    }
  },

};

export default loanService;
