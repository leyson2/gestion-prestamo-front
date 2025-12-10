import { useState } from 'react';
import LoanForm from '../components/Loans/forms/LoanForm';
import LoanList from '../components/Loans/LoanList';
import StatusModal from '../components/Loans/modals/StatusModal';

const LoansPage = () => {
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLoan(null);
  };

  return (
    <>
      <LoanForm onLoanCreated={handleLoanCreated} />
      <LoanList
        refreshTrigger={refreshTrigger}
        onStatusChange={handleStatusChange}
      />
      <StatusModal
        loan={selectedLoan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusUpdated={handleStatusUpdated}
      />
    </>
  );
};

export default LoansPage;
