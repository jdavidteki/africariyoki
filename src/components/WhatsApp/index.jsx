import React, { Component }  from "react";
import WhatsappIcon from "../../../static/img/whatsapp.gif";

import "./Whatsapp.css";

class Whatsapp extends Component {
  constructor(props){
    super(props);
    this.state= {
        messageToSend: props.messageToSend,
        showWhatsAppText: props.showWhatsAppText
    }
  }

  render(){
    return (
      <div className="WhatsApp">
        {this.state.showWhatsAppText &&
          <span>whatsApp: </span>
        }
        <a className="WhatsApp-link" href={`whatsapp://send?text=${this.state.messageToSend}`}>
          <img className="WhatsApp-img" src={WhatsappIcon} alt="funny animation GIF" />
        </a>
      </div>

    );
  }
}

export default Whatsapp;
