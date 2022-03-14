import React, { Component } from "react";
import { Link } from 'react-router-dom'
import logo from './assets/logo.png';

import './Header.css';


class Header extends Component {

  state={
    shake: "shake",
  }

  componentDidMount(){
    //if you are on homepage, refresh page on icon logo click
    document.getElementById("headerLogoImage").addEventListener('click', ()=>{
      if(window.location.pathname == "/" || window.location.pathname == "/africariyoki"){
        document.location.reload(true)
      }
    })

    setInterval(
      ()=>{
        if (this.state.shake == ""){
          this.setState({shake: "shake"})
        }else{
          this.setState({shake: ""})
        }
      },
    10000)
  }

  render() {
    return (
      <div className="Header chrome">
        <div className="Header-container">
          <div className="Header-left" id="headerLogoImage">
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