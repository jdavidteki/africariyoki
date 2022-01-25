

import React, { Component } from "react";
import blankBack from "./assets/blankBack.jpeg"
import { View } from 'react-native';

import { styles } from './BackgroundImagesStyle.js'

class BackgroundImages extends Component {

	state={
		background: blankBack,
	}

	componentDidMount(){
    setTimeout( () => {
      this.setState({
        background: this.getRandomBackground(),
      })
    }, 500);
	}

	getRandomBackground(){
    let randomNumber =  Math.floor(Math.random() * (11 - 1 + 1) + 1)
    let backgroundToReturn = ""
    let bckImageNum = ""

    switch(randomNumber) {
      case 1:
        bckImageNum = 1
        backgroundToReturn = "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck1bck.jpeg?alt=media"
        break
      case 2:
        bckImageNum = 2
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck2bck.jpeg?alt=media"
        break
      case 3:
        bckImageNum = 3
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck3bck.jpeg?alt=media"
        break
      case 4:
        bckImageNum = 4
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck4bck.jpeg?alt=media"
        break
      case 5:
        bckImageNum = 5
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck5bck.jpeg?alt=media"
        break
      case 6:
        bckImageNum = 6
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck6bck.jpeg?alt=media"
        break
      case 7:
        bckImageNum = 7
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck7bck.jpeg?alt=media"
        break
      case 8:
        bckImageNum = 8
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck8bck.jpeg?alt=media"
        break
      case  9:
        bckImageNum = 9
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck9bck.jpeg?alt=media"
        break
      case 10:
        bckImageNum = 10
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck10bck.jpeg?alt=media"
        break
      default:
        bckImageNum = 11
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck11bck.jpeg?alt=media"
        break
    }

    this.setState({bckImageNum: bckImageNum})

    return backgroundToReturn
  }

	render() {
		return (
			<View
				style={styles(this.state.background).background}
				className="Composer-background"
			>
				<View style={styles(this.state.background).backgroundOverlay} className="Composer-backgroundOverlay"></View>
			</View>
		);
	}
}

export default BackgroundImages;