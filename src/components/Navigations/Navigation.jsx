import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="main-navigation">
      <div className="nav-container">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Préstamos
        </NavLink>
        <NavLink 
          to="/equipos" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Equipos
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
