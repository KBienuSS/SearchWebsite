import {
  Navbar,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import './MainMenu.scss';
import { useState } from 'react';

const MainMenu = () => {
  const [isLoggedIn, setIsLogged] = useState(false);

  return (
    <Navbar expand="md" container={false} className="main-navbar animated fadeIn" light>
      <Nav className="main-nav-left" navbar>
        <NavItem>
          <NavLink href="/" className="nav-link-custom">Home</NavLink>
        </NavItem>
      </Nav>

      <Nav className="main-nav-right align-items-center" navbar>
        <NavItem>
          <NavLink href="/login" className="nav-link-custom">Sign In</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/register" className="nav-link-cta">Sign Up</NavLink>
        </NavItem>
        {isLoggedIn && (
          <NavItem>
            <NavLink href="/logout" className="nav-link-danger">Sign Out</NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default MainMenu;