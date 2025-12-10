import { useState } from 'react';
import EquipmentList from '../components/Equipments/EquipmentList';
import EquipmentForm from '../components/Equipments/forms/EquipmentForm';


const EquipmentPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEquipmentCreated = (newEquipment) => {
    console.log('Nuevo equipo creado:', newEquipment);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <EquipmentForm onEquipmentCreated={handleEquipmentCreated} />
      <EquipmentList refreshTrigger={refreshTrigger} />
    </>
  );
};

export default EquipmentPage;
