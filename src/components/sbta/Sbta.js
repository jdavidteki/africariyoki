import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Button from "@material-ui/core/Button";


class Sbta extends Component {
  constructor(props){
    super(props);
    this.state= {
        showArtDesc: false,
    }
  }

    componentDidMount(){

    }

    render() {
        return (
            <div className="Sbta">
                <div className="Sbta-wrapper">
                    <div className="Sbta-bulb">
                        <input type="checkbox" />
                        <div></div>
                    </div>
                    {this.state.showArtDesc &&
                        <div className="Sbta-artDesc">
                            <Button
                                onClick={() => this.setState({selectedCode: ""})}
                                >
                                <CloseIcon/>
                            </Button>
                            <img className="Sbta-image" src={this.props.imageBck} />
                            <div className="Sbta-Desc">
                                text
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Sbta;
