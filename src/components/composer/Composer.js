import React, { Component } from 'react';
import { View } from 'react-native';
import Header from '../header/Header';
import BackgroundImages from '../backgroundImages/BackgroundImages.js'

import { styles } from './ComposerStyle.js'

class Composer extends Component {
  constructor(props){
    super(props);

    this.state= {
      songs: [],
			headerMode: "",
    }
  }

  componentDidMount () {

  }

  render() {
    return (
			<View style={styles.composer} className="Composer">
				<BackgroundImages />

				<View style={styles.container} class="Composer-container">
					<Header mode={this.state.headerMode}/>

					<View class="Composer-pageContent">
						{/* logic to decide what page to show in here */}
					</View>

					{/* <Footer /> */}
				</View>
			</View>
    )
  }
}

export default Composer;

//https://www.lalal.ai/?gclid=CjwKCAiArbv_BRA8EiwAYGs23LTomkIzDCGjHTkK-SQlhargxYyajraHsgux9WClyYvOXJnLQ7surhoCNbIQAvD_BwE
//https://mp3downy.com/MP3-converter?apikey=1234567890

//do  ./ngrok http 5000 in /vocalremover to run ngrok


//for free images https://www.pexels.com/search/nigeira/

// https://unsplash.com/s/photos/south-africa
