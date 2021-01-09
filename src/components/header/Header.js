import React, { Component } from "react";
import './Header.css';
import { Link } from 'react-router-dom'

class Header extends Component {
  render() {
    return (
      <div className="Header">
          <div style={{ fontWeight: 900 }} >AFRICARIYOKI -</div>
          <div className="right-part">
            <Link
                variant="outlined"
                style={{ marginRight: 20, fontSize: 18 }}
                color="primary"
                to = "/africariyoki/upload"
              >
                Upload
              </Link>
          </div>
      </div>
    );
  }
}

export default Header;