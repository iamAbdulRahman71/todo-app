import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function Header() {
  const history = useHistory();
  const { token, setToken } = useContext(AuthContext);

  const handleLogout = () => {
    setToken(null);
    history.push('/login');
  };

  return (
    <Navbar expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          To Do App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>
          )}
          {token && (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
