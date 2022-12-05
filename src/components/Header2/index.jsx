import React, { Component } from "react";
import Menu2 from "../Menu2";
import Section1 from "../Section1";
import HomePageLogo from "../../../static/img/newlogohome.png";
import EveryOtherLogo from "../../../static/img/newlogoother.png";
import Firebase from "../../firebase/firebase.js";

import "./Header.css";

class Header extends Component{
  constructor(props){
    super(props)

    this.state={
      callerComponent: props.callerComponent,
      randomSongID: '00R4dOtzDIA',
    }
  }

  componentDidMount(){
    Firebase.getLyrics().then(
      val => {
          val = val.filter(v => v.turnedOn == 1);
          let songInQuestionIndex = Math.floor(Math.random() * (val.length - 0) + 0);

          this.setState({
            randomSongID: val[songInQuestionIndex].id,
          })
      }
    )

    //if you are on homepage, refresh page on icon logo click
    document.getElementById("headerLogoImage").addEventListener('click', ()=>{
      if(window.location.pathname == "/" || window.location.pathname == "/africariyoki"){
        window.location.reload(false);
      }
    })

    setTimeout(()=>{
      if(window.location.pathname == "/" || window.location.pathname == "/africariyoki"){
        Firebase.getVersion().then(
          val => {
            let localVersion = localStorage.getItem('version')

            if (localVersion == null || val > localVersion){
              localStorage.setItem('version', val);

              //when there is a new version, the service workers should sense it
              //and load new css/js but trigger a reload for changes to reflect
              window.location.href = window.location.href
            }
          }
        )
      }
    },10000); //give the cache two seconds to load before refreshing page
  }

  render(){
    return (
      <div className="Header" id="headerLogoImage">
        {
          this.state.callerComponent == 'homepage' ?
            <Section1 src={HomePageLogo} />
          :
            <div className="nav-bar">
              <a href="/"> <img className="logo-4" src={EveryOtherLogo} /> </a>
              <div className="frame-173">
                <div className={this.state.callerComponent +  " menu-4"} onClick={() => window.location.href = "/karaoke/"+this.state.randomSongID}>
                  <div className="games-5 valign-text-middle poppins-medium-martinique-20px">
                    <span>
                      <span className="poppins-medium-martinique-20px">karaoke</span>
                    </span>
                  </div>
                </div>
                <Menu2 callerComponent={this.state.callerComponent}/>
              </div>
            </div>
        }
      </div>
    );
  }
}

export default Header;
