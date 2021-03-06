/* eslint-disable max-len */
import React from 'react';
import apiUrl from '../../utils/Env';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import {saveAs} from 'file-saver';
import {withAuth0} from '../../utils/Auth0Wrapper';

// eslint-disable-next-line require-jsdoc
class DataExports extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line require-jsdoc
  downloadData(toDownload) {
    // eslint-disable-next-line react/prop-types
    const {token} = this.props;
    const body = {
      toDownload: toDownload,
    };
    fetch(apiUrl() + '/dataDownload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((response) => (response.blob()))
        .then((blob) => {
          saveAs(blob, toDownload + Date.now().toString() + '.csv');
        });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    // const {, difference} = this.state;
    return (
      <div>
        <Paper elevation={2} style={{width: 300, padding: 20}}>
          <div style={{paddingBottom: 10, fontSize: 20}}>
            Data Exports
          </div>
          <div style={{paddingBottom: 10, fontSize: 15}}>
            Download .csv files of the data
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <Button onClick={() => {
              this.downloadData('students');
            }} variant='contained' >Student Data</Button>
            <Button onClick={() => {
              this.downloadData('parents');
            }} variant='contained' >Parent Data</Button>
          </div>
          <br/>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
            <Button onClick={() => {
              this.downloadData('forms');
            }} variant='contained' >Form Data</Button>
            <Button onClick={() => {
              this.downloadData('users');
            }} variant='contained' >User Data</Button>
          </div>
        </Paper>
      </div>
    );
  }
}
export default withAuth0(DataExports);
