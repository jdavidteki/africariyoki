import React, { Component } from 'react';

class Filter extends Component {
  render() {
    return (
      <div className="filter">
        <label htmlFor="title-filter">Title: </label>
        <input onChange={(event)=> this.props.filterSong(event.target.value)} id="title-filter" type="text" value={this.props.filteredSongs} />
      </div>
    );
  }
}

//spotify access token - BQBC1P9FomMBkGge9c4gtXu4kudpeoJ0Np8cReDe0qsTWaWJSrGTo8Q4l1RYtbk3Weh4A3CybZtoFJVchjemPKYMNrvQtR9-G9uU5XA-oSoLs84zBRpL3aPGjGIvKfLYCvbfPBbJ7cfmBMrqT5vm0OIGXX0nmVg
export default Filter;
