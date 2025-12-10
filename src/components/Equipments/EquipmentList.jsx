import { useState, useEffect } from 'react';
import equipmentService from '../../services/equipmentService';
import Pagination from '../Pagination';
import Swal from 'sweetalert2';
import './EquipmentList.css';

const EquipmentList = ({ refreshTrigger }) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadEquipment();
  }, [refreshTrigger]);

  const loadEquipment = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await equipmentService.getSelect();
      setEquipment(data);
      console.log('Equipos cargados:', data);
    } catch (err) {
      setError('Error al cargar los equipos. Por favor intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  const filteredEquipment = equipment.filter((equip) =>
    equip.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipment.slice(indexOfFirstItem, indexOfLastItem);

  // Resetear a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="equipment-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="equipment-list-container">
      <div className="list-header">
        <h2>Lista de Equipos</h2>
        <button
          onClick={loadEquipment}
          className="btn-refresh"
          title="Actualizar lista"
        >
          Actualizar
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="search">Buscar:</label>
          <input
            type="text"
            id="search"
            placeholder="Nombre del equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredEquipment.length === 0 ? (
        <div className="empty-state">
          <h3>No hay equipos registrados</h3>
          <p>
            {searchTerm
              ? 'No se encontraron equipos con el término de búsqueda.'
              : 'Comienza registrando un nuevo equipo usando el formulario.'}
          </p>
        </div>
      ) : (
        <>
          <div className="equipment-count">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEquipment.length)} de {filteredEquipment.length} equipo(s){filteredEquipment.length !== equipment.length && ` (${equipment.length} total)`}
          </div>

          <div className="table-responsive">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((equip) => (
                  <tr key={equip.code}>
                    <td data-label="Código">
                      <span className="code-badge">{equip.code}</span>
                    </td>
                    <td data-label="Nombre">
                      <span className="equipment-name">{equip.nombre}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}
    </div>
  );
};

export default EquipmentList;
