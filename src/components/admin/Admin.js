import React, { Component } from "react";
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data } from "react-data-grid-addons";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import UploadContent from '../uploadcontent/UploadContent.js'

import 'bootstrap/dist/css/bootstrap.css';
import "./Admin.css"

const defaultColumnProperties = {
    filterable: true,
    width: 200,
    resizable: true,
    editable: true,
    adminLoggedIn: false,
};

const selectors = Data.Selectors;

const columns = [{
    key: 'id',
    name: 'Song ID',
  }, {
    key: 'lyrics',
    name: 'Lyrics',
  }, {
    key: 'singer',
    name: 'Singer',
    sort: true,
},{
    key: 'title',
    name: 'Title',
}].map(c => ({ ...c, ...defaultColumnProperties }));

class ConnectedAdmin extends Component {

    state = {
        songs:[],
        filters: [],
        filteredRows: [],
        selectedIndexes: [],
        rows:[],
        selectedSongIds: [],
        selectedSongLyrics: '',
    };

    componentDidMount(){
        this.adminLogIn()

        Firebase.getLyrics().then( val => {
            this.setState({songs: val, filteredRows: this.getRows(val)})
        })
    }

    handleFilterChange=(filter)=>{
        const newFilters = { ...this.state.filters };

        if (filter.filterTerm) {
          newFilters[filter.column.key] = filter;
        } else {
          delete newFilters[filter.column.key];
        }

        let rows = this.state.songs
        let filters = this.state.filters
        let filteredRows = selectors.getRows({ rows, filters })

        this.setState({filters: newFilters, filteredRows: filteredRows})
    };

    getRows(val) {
        let rows = val
        let filters = this.state.filters

        return selectors.getRows({ rows, filters });
    }

    onRowsSelected = rows => {
        this.setState({
          selectedSongIds: this.state.selectedSongIds.concat(
              rows.map(r => r.row.id)
          ),
          selectedIndexes: this.state.selectedIndexes.concat(
            rows.map(r => r.rowIdx)
          ),
          selectedSongLyrics: rows[0].row.lyrics
        });
    };

    onRowsDeselected = rows => {
        let rowIndexes = rows.map(r => r.rowIdx);
        this.setState({
            selectedIndexes: this.state.selectedIndexes.filter(
            i => rowIndexes.indexOf(i) === -1
            )
        });
    };

    onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        this.setState(state => {
          const rows = state.rows.slice();
          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
          }
          return { rows };
        });
    };

    adminLogIn(){
        var tenure = prompt("Please enter master password to continue", "");
        if (tenure != null && tenure == "1226") {
            this.setState({adminLoggedIn: true})
        }else{
          alert("you are a liar and a fraud!!!")
          this.setState({adminLoggedIn: false})
        }
    }

    deleteSong(){
        var tenure = prompt("Please enter master password", "");
        if (tenure != null && tenure == "1226") {
            for (let i = 0; i < this.state.selectedSongIds.length; i++) {
                Firebase.deleteRecp(this.state.selectedSongIds[i])
                Firebase.storage().refFromURL(`gs://africariyoki-4b634.appspot.com/music/${this.state.selectedSongIds[i]}.mp3`).delete()
            }
        }else{
          alert("sorry, invalid password")
        }
    }

    updateSong(){
        this.props.history.push({
            pathname: "/africariyoki/lrcfixer/" + this.state.selectedSongIds[0],
            state: {
                lyrics: this.state.selectedSongLyrics,
                songId: this.state.selectedSongIds[0],
            }
        });
        window.location.reload(true);
    }

    render() {
        if (!this.state.adminLoggedIn){
            return (
                <div lassName="Admin">
                    unauthorized access to this page!
                </div>
            )
        }
        return (
            <div className="Admin">
                <div className="Admin-table">
                    <ReactDataGrid
                        rowKey="id"
                        columns={columns}
                        rowGetter={i => this.state.filteredRows[i]}
                        rowsCount={this.state.filteredRows.length}
                        minHeight={500}
                        onRowsUpdate={this.onGridRowsUpdated}
                        enableCellSelect={true}
                        toolbar={<Toolbar enableFilter={true} />}
                        onAddFilter={filter => this.handleFilterChange(filter)}
                        onClearFilters={() => this.setState({filters: []})}
                        rowSelection={{
                            showCheckbox: true,
                            enableShiftSelect: true,
                            onRowsSelected: this.onRowsSelected,
                            onRowsDeselected: this.onRowsDeselected,
                            selectBy: {
                              indexes: this.state.selectedIndexes
                            }
                        }}
                    />
                    <Button
                        style={{ marginTop: 20, width: 200 }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.deleteSong()
                        }}
                    >
                        ({this.state.selectedIndexes.length}) Delete
                    </Button>
                    {" "}
                    {
                        this.state.selectedIndexes.length == 1 && (
                            <Button
                                style={{ marginTop: 20, width: 200 }}
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    this.updateSong()
                                }}
                            >
                             Update Lyrics
                            </Button>
                        )
                    }
                    <UploadContent />
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {};
};

const admin = withRouter(connect(mapStateToProps)(ConnectedAdmin));
export default admin;


//https://material-ui.com/components/material-icons/#material-icons