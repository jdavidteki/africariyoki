import React, { Component } from "react";
import { Link } from 'react-router-dom'
import logo from './assets/logo.png';

import './Header.css';
class Header extends Component {
  render() {
    return (
      <div className="Header chrome">
        <div className="Header-container">
            <div className="Header-left">
              <Link
                to = "/africariyoki"
              >
                <img className="Header-logo" src={logo} alt="Logo" />
              </Link>
            </div>
            <div className="Header-right">
              <Link
                    className="Header-navLink"
                    variant="outlined"
                    color="primary"
                    to = "/africariyoki"
                  >
                      home
              </Link>
              {/* <Link
                    className="Header-navLink"
                    variant="outlined"
                    color="primary"
                    to = "/africariyoki/about"
                  >
                      about
              </Link> */}
              <Link
                  className="Header-navLink"
                  variant="outlined"
                  color="primary"
                  to = "/africariyoki/admin"
                >
                    admin
              </Link>
            </div>
        </div>
      </div>
    );
  }
}

export default Header;