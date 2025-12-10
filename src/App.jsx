import { useState } from 'react';
import LoanForm from './components/LoanForm';
import LoanList from './components/LoanList';
import StatusModal from './components/StatusModal';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoanCreated = (newLoan) => {
    console.log('Nuevo préstamo creado:', newLoan);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleStatusChange = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleStatusUpdated = (updatedLoan) => {
    console.log('Préstamo actualizado:', updatedLoan);
    setRefreshTrigger(prev => prev + 1);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Gestión de Préstamos</h1>
        <p>Administra los préstamos de equipos de forma eficiente</p>
      </header>

      <main className="app-main">
        <LoanForm onLoanCreated={handleLoanCreated} />
        <LoanList
          refreshTrigger={refreshTrigger}
          onStatusChange={handleStatusChange}
        />
      </main>

      <StatusModal
        loan={selectedLoan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdated={handleStatusUpdated}
      />

      <footer className="app-footer">
        <p>&copy; 2025 Sistema de Préstamos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
