import { useState, useEffect } from "react";
import loanService from "../services/loanService";
import LoanDetailModal from "./LoanDetailModal";
import Swal from "sweetalert2";
import "./LoanList.css";

const LoanList = ({ refreshTrigger, onStatusChange }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Cargar préstamos al montar el componente y cuando cambie refreshTrigger
  useEffect(() => {
    loadLoans();
  }, [refreshTrigger]);

  const loadLoans = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await loanService.getAllLoans();
      setLoans(data);
      console.log("Préstamos cargados:", data);
    } catch (err) {
      setError("Error al cargar los préstamos. Por favor intente nuevamente.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusClick = (loan) => {
    if (onStatusChange) {
      onStatusChange(loan);
    }
  };

  const handleViewDetails = (loan) => {
    setSelectedLoan(loan);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedLoan(null);
  };

  const handleDelete = async (loan) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Esta acción eliminará el préstamo de ${loan.solicitante} (${loan.equipo}). ¡No se puede deshacer!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        await loanService.deleteLoan(loan.code);

        Swal.fire({
          title: "¡Eliminado!",
          text: "El préstamo ha sido eliminado exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Recargar la lista
        loadLoans();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: error.message || "No se pudo eliminar el préstamo",
          icon: "error",
          confirmButtonColor: "#3498db",
        });
      }
    }
  };

  const getStatusBadgeClass = (estado) => {
    const statusMap = {
      Solicitado: "status-solicitado",
      Devuelto: "status-devuelto",
      Entregado: "status-entregado",
    };
    return statusMap[estado] || "status-default";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Filtrar préstamos
  const filteredLoans = loans.filter((loan) => {
    const matchesStatus =
      filterStatus === "all" || loan.estado === filterStatus;
    const matchesSearch =
      loan.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.correo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loan-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando préstamos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loan-list-container">
      <div className="list-header">
        <h2>Lista de Préstamos</h2>
        <button
          onClick={loadLoans}
          className="btn-refresh"
          title="Actualizar lista"
        >
          Actualizar
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filtros */}
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="search">Buscar:</label>
          <input
            type="text"
            id="search"
            placeholder="Nombre, equipo o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Estado:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">Todos</option>
            <option value="SOLICITADO">Solicitado</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="DEVUELTO">Devuelto</option>
          </select>
        </div>
      </div>

      {/* Tabla de préstamos */}
      {filteredLoans.length === 0 ? (
        <div className="empty-state">
          <h3>No hay préstamos registrados</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "No se encontraron préstamos con los filtros aplicados."
              : "Comienza registrando un nuevo préstamo usando el formulario."}
          </p>
        </div>
      ) : (
        <>
          <div className="loans-count">
            Mostrando {filteredLoans.length} de {loans.length} préstamo(s)
          </div>

          <div className="table-responsive">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Correo</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Fecha del Préstamo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <tr key={loan.code}>
                    <td data-label="Solicitante">
                      <div className="user-info">
                        <span className="user-name">{loan.solicitante}</span>
                      </div>
                    </td>
                    <td data-label="Correo">{loan.correo}</td>
                    <td data-label="Equipo">
                      <span className="equipment-badge">{loan.equipo}</span>
                    </td>
                    <td data-label="Estado">
                      <span
                        className={`status-badge ${getStatusBadgeClass(
                          loan.estado
                        )}`}
                      >
                        {loan.estado}
                      </span>
                    </td>
                    <td data-label="Fecha del Préstamo">
                      {formatDate(loan.fecha_prestamo)}
                    </td>
                    <td data-label="Acciones">
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewDetails(loan)}
                          className="btn-action btn-view"
                          title="Ver detalles"
                        >
                          Ver Detalles
                        </button>
                        {loan.estado !== 'DEVUELTO' ? (
                          <>
                            <button
                              onClick={() => handleStatusClick(loan)}
                              className="btn-action btn-update"
                              title="Actualizar estado"
                            >
                              Actualizar
                            </button>
                            <button
                              onClick={() => handleDelete(loan)}
                              className="btn-action btn-delete"
                              title="Eliminar préstamo"
                            >
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <span className="no-actions-text">
                            Préstamo finalizado
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal de detalles */}
      <LoanDetailModal
        loan={selectedLoan}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default LoanList;
