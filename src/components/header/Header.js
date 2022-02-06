import React, { Component } from "react";
import { Link } from 'react-router-dom'
import logo from './assets/logo.png';

import './Header.css';


class Header extends Component {

  state={
    shake: "shake",
  }

  componentDidMount(){
    setInterval(
      ()=>{
        if (this.state.shake == ""){
          this.setState({shake: "shake"})
        }else{
          this.setState({shake: ""})
        }
      },
    5000)
  }

  render() {
    return (
      <div className="Header chrome">
        <div className="Header-container">
          <div className="Header-left">
            <Link
              to = "/"
            >
              <img className={`Header-logo ${this.state.shake}`} src={logo} alt="Logo" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;