import React, { Component } from "react";
import { Link } from 'react-router-dom'

import './Header.scss';
class Header extends Component {
  render() {
    return (
      <div className="Header">
          <Link style={{ fontFamily:'fantasy', fontWeight: 900, textDecoration: 'none', color: 'green' }} to = "/africariyoki">africariyoki!</Link>
          <div className="right-part">
            <Link
              variant="outlined"
              style={{ fontFamily:'fantasy', color: 'green', marginRight: 20, fontSize: 18, textDecoration: 'none' }}
              color="primary"
              to = "/africariyoki/upload"
            >
                upload
            </Link>
          </div>
      </div>
    );
  }
}

export default Header;