import React, { Component } from "react";
import MetaTags from 'react-meta-tags';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { GetRandomBackground, ShuffleArray } from "../helpers/Helpers";
import TempBackground from "../../../static/img/whitebackground.png"
import Header from "../Header2";
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import TextField from "@material-ui/core/TextField";
import { TwitterTweetEmbed } from 'react-twitter-embed';
import toxicAuntiesLogo from "../../../static/img/toxicauntieslogo.png";

import "./YokiTweets.css";

class ConnectedYokiTweets extends Component {
  constructor(props){
      super(props);
      this.state= {
        overlapGroup: TempBackground,
        tweetId: "1579506101305114625",
        inputTweetURL: "",
        hideTweet: false
      }
  }

  componentDidMount(){
    //hack: use this to fix github pages doing ?/ on pages
    if (window.location.href.includes("?/")){
      let actualDestination = window.location.href.split("?/")[1]
      if(this.props.history == undefined){
        //TODO: figure out if it's possible to not have to do this
        window.location.href = "/" + actualDestination
      }else{
        this.props.history.push({
          pathname: "/" + actualDestination
        });
        window.location.reload(false);
      }
    }

    var urlParams = new URLSearchParams(window.location.search);
    var bckId = urlParams.get('bckId')

    setTimeout( () => {
      this.setState({
        overlapGroup: GetRandomBackground(bckId),
      })
    }, 500);
  }

  render(){
    return (
      <div className="YokiTweets">
        <MetaTags>
          <title>africariyoki ::: yoki tweets</title>
          <meta name="description" content={`yokitweets`} />
          <meta property="og:title" content="africariyoki" />
          <meta httpEquiv='cache-control' content='no-cache' />
          <meta httpEquiv='expires' content='0' />
          <meta httpEquiv='pragma' content='no-cache' />
        </MetaTags>
        <div
          style={{ backgroundImage: `url(${this.state.overlapGroup})` }}
          className="overlap-group-40">
            <div className="overlap-group-40-dark"></div>
        </div>
        <div className="overlap-group1-14">
        <div className="section1-3">
          <Header callerComponent={"karaokepage"} />
        </div>
        <div className="YokiTweets-wrapper section2-2">

          <TextField
            value={this.state.inputTweetURL}
            className="YokiTweets-input YokiTweets-gameOption"
            label={"enter embeded tweet URL"}
            onChange={this.handleTweetURL}
          />

          <div className="YokiTweets-display">
            {this.state.hideTweet ?
                <div>loading</div>
              :
                <TwitterTweetEmbed
                  tweetId={this.state.tweetId}
                />
            }

          </div>

          <img className="YokiTweets-logo" src={toxicAuntiesLogo} />

        </div>
        <FooterMenuFooterDefault className={"footer-default-3"} />
        </div>
      </div>
    );
  }


  handleTweetURL = inputTweetURL => {
    let inputTweetURLString = inputTweetURL.target.value
    this.setState({hideTweet: true})
    this.setState({ inputTweetURL: inputTweetURLString });

    var regex = new RegExp(/https?:\/\/twitter.com\/[a-zA-Z_]{1,20}\/status\/([0-9]*)/gm),
        results = regex.exec(inputTweetURLString);

    if (results != null){
      this.setState({
        tweetId: results[1],
        hideTweet: false
      });
    }
  };
}

const mapStateToProps = state => {
  return {};
};

let YokiTweets = withRouter(connect(mapStateToProps)(ConnectedYokiTweets));
export default withRouter(YokiTweets);