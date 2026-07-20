import { Navbar,Nav,NavItem,NavLink } from 'react-bootstrap';
import './MainMenu.scss';
import { useSelector } from 'react-redux';
import { getUser } from '../../../redux/usersRedux';

const MainMenu = () => {
  const isLoggedIn = useSelector(getUser);

  return (
    <Navbar expand="md" className="main-navbar animated fadeIn">
      <Nav className="main-nav-left" navbar>
        <NavItem>
          <NavLink href="/" className="nav-link-custom">Home</NavLink>
        </NavItem>
      </Nav>

      <Nav className="main-nav-right align-items-center" navbar>
        {isLoggedIn ? (
          <>
          <NavItem>
            <NavLink href="/ad/add" className="nav-link-custom">Add New</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/logout" className="nav-link-danger">Sign Out</NavLink>
          </NavItem>
          </>
        ) : (
        <>
          <NavItem>
            <NavLink href="/login" className="nav-link-custom">Sign In</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/register" className="nav-link-cta">Sign Up</NavLink>
          </NavItem> 
        </>
          )}
      </Nav>
    </Navbar>
  );
};

export default MainMenu;