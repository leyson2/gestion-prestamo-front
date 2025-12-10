const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const handleResponse = async (response) => {
  if (response.status !== 'success') {
    throw new Error(response.message || 'Error en la solicitud');
  }
  return response.data;
};


const equipmentService = {

  getSelect: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipos/`, {
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

  createEquipment: async (equitData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/equipos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equitData),
      });
      const data = await response.json();
      return await handleResponse(data);
    } catch (error) {
      console.error('Error al crear el equipo:', error);
      throw error;
    }
  },

}

export default equipmentService;