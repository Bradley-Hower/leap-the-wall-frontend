import React from 'react';
import { Navbar, NavItem } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { withAuth0 } from "@auth0/auth0-react";
import LoginButton from './Login';
import LogoutButton from './Logout';
import Username from './Username';

class Header extends React.Component {
  constructor(props){
    super(props);
  }

  
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="light" variant="light">

          {/* <NavItem><Link to="/" className="nav-link">Home</Link></NavItem>
          <NavItem><Link to="/about" className="nav-link">About</Link></NavItem> */}
          <NavItem><Link to="/profile" className="nav-link">Profile</Link></NavItem>
          <NavItem>{this.props.auth0.isAuthenticated ? <div><p>Welcome back, </p><Username /></div> : <p></p>}</NavItem>
          <NavItem>{this.props.auth0.isAuthenticated ? <LogoutButton/> : <LoginButton/>}</NavItem>
          
      </Navbar>
    )
  }
}

export default withAuth0(Header);
