/* eslint-disable react/prop-types,max-len */
import React from 'react';
import {Button, CircularProgress} from '@material-ui/core';
import {ReactFormBuilder} from 'react-form-builder2';
import './css/bootstrap.min.css';
import './css/font-awesome.min.css';
import DemoBar from './DemoBar';
import fetch from 'isomorphic-fetch';
import {withAuth0} from '../../../utils/Auth0Wrapper';
import apiUrl from '../../../utils/Env';
require('./scss/application.scss');

// eslint-disable-next-line require-jsdoc
class BlankFormBuilder extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      currentFormID: this.props.match.params.id,
      blankFormData: [],
      blankFormName: null,
      retrieved: false,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {token} = this.props;
    const {currentFormID} = this.state;
    const body = {
      form_id: currentFormID,
    };
    if (currentFormID) {
      fetch(apiUrl() + '/getBlankForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }).then((response) => (response.json()))
          .then((data) => {
            this.setState({
              blankFormData: data.data,
              blankFormName: 'COPY OF ' + data.name,
              retrieved: true,
            });
          });
    } else {
      this.setState({retrieved: true});
    }
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {blankFormData, retrieved, blankFormName} = this.state;

    if (!retrieved) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 100}}>
          <CircularProgress/>
        </div>
      );
    }
    return (<div style={{
      display: 'flex',
      justifyContent: 'center',
      marginLeft: '10%',
    }}>
      <div style={{width: '100%', maxWidth: 1000}}>
        <div className="fm-container">
          <React.Fragment>
            <Button
              variant='contained'
              onClick={() => this.props.history.goBack()}
              style={{marginTop: 30, marginBottom: 10}}
            >
                      back
            </Button>
            <DemoBar blankFormName={blankFormName} {...this.props}/>
            <ReactFormBuilder data={blankFormData}/>
          </React.Fragment>
        </div>
      </div>
    </div>);
  }
}


export default withAuth0(BlankFormBuilder);
