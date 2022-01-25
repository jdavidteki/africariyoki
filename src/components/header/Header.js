import React, { Component } from "react";
import logo from './assets/logo.png';
import Firebase from "../../firebase/firebase.js";
import { View, Image, Text } from 'react-native';
import DropDown from '../dropDown/DropDown.js';

import { styles } from './HeaderStyle'


class Header extends Component {

  state={
    shake: "shake",
    styleSettings: {
      mode: this.props.mode,
      karoakeTabClicked: false,
    },
  }

  componentDidMount(){
    //if you are on homepage, refresh page on icon logo click
    document.getElementById("headerLogoImage").addEventListener('click', ()=>{
      if(window.location.pathname == "/" || window.location.pathname == "/africariyoki"){

        Firebase.getVersion().then(
          val => {
            let localVersion = localStorage.getItem('version')

            if (localVersion == null || val > localVersion){
              localStorage.setItem('version', val);

              if(caches) {
                // Service worker cache should be cleared with caches.delete()
                console.log("caches", caches)
                caches.keys().then(function(names) {
                  for (let name of names) caches.delete(name);
                });
              }

              window.location.href = window.location.href + `?hardrefresh=${val}`
            }else{
              window.location.reload(false);
            }
          }
        )
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
      <View style={styles(this.state.styleSettings).header} className="Header chrome">
        <View style={styles(this.state.styleSettings).container} className="Header-container">
          <View style={styles(this.state.styleSettings).left} className="Header-left">
            <Image style={styles(this.state.styleSettings).logo} className={`Header-logo ${this.state.shake}`} source={logo} alt="Logo" />
          </View>

          {this.state.styleSettings.mode != "simple" &&
            <View style={styles(this.state.styleSettings).right} className="Header-right">
              <Text
                style={styles(this.state.styleSettings).navLink}
                className="Header-navLink"
                onPress={() => this.setState({styleSettings: {karoakeTabClicked: true}})}
              >
                karaoke
              </Text>
              <DropDown
                style={styles(this.state.styleSettings).navLink}
                className="Header-navLink" title="games" options={['Apple', 'Orange', 'Pear', 'Mango']}
              />
              {/* <Text
                style={styles(this.state.styleSettings).games}
                className="Header-navLink"
              >
                games
              </Text> */}
            </View>
          }
        </View>
      </View>
    );
  }
}

export default Header;