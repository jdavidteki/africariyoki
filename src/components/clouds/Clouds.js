import React, { Component } from "react";

import "./Clouds.scss"

class Clouds extends Component {

    state = {
        albumName: "",
    };


    render() {
        return (
            <div className="Clouds" id="clouds">
                <div class="cloud x1"></div>
                <div class="cloud x2"></div>
                <div class="cloud x3"></div>
                <div class="cloud x4"></div>
                <div class="cloud x5"></div>
            </div>
        )
    }
}

export default Clouds;
