import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigations/Navigation';
import LoansPage from './pages/LoansPage';
import EquipmentPage from './pages/EquipmentPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Sistema de Gestión de Préstamos</h1>
          <p>Administra los préstamos de equipos de forma eficiente</p>
        </header>

        <Navigation />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<LoansPage />} />
            <Route path="/equipos" element={<EquipmentPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 Sistema de Préstamos. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
