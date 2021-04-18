import React, { Component } from "react";

import "./Clouds.scss"

class Clouds extends Component {

    state = {
        albumName: "",
    };


    render() {
        return (
            <div className="Clouds" id="clouds">
                <div className="cloud x1"></div>
                <div className="cloud x2"></div>
                <div className="cloud x3"></div>
                <div className="cloud x4"></div>
                <div className="cloud x5"></div>
            </div>
        )
    }
}

export default Clouds;
