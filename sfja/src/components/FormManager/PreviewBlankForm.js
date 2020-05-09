/* eslint-disable max-len */
import React from 'react';
import fetch from 'isomorphic-fetch';
import TextField from '@material-ui/core/TextField';
import PropTypes, {instanceOf} from 'prop-types';
import {Button} from '@material-ui/core';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';
import Paper from '@material-ui/core/Paper';
import {ReactFormGenerator} from 'react-form-builder2';
import SnackBarMessage from '../../utils/SnackBarMessage';

const textSize = {
  style: {fontSize: 15},
  autocomplete: 'new-password',
};

// eslint-disable-next-line require-jsdoc
class PreviewBlankForm extends React.Component {
    static propTypes = {
      formsList: PropTypes.any,
      currentForm: PropTypes.any,
      setViewForm: PropTypes.func,
      cookies: instanceOf(Cookies).isRequired,
      openFailureMessage: false,
      openSuccessMessage: false,
    };
    // eslint-disable-next-line require-jsdoc
    constructor(props) {
      super(props);
      this.state = {
        newName: props.currentForm.name,
        blankFormData: null,
      };
    }

    // eslint-disable-next-line require-jsdoc
    componentDidMount() {
      const {cookies, currentForm} = this.props;
      const body = {
        form_id: currentForm.id,
      };

      fetch(apiUrl() + '/getBlankForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify(body),
      }).then((response) => (response.json()))
          .then((data) => {
            this.setState({
              blankFormData: data.data,
            });
          });
    }

    // eslint-disable-next-line require-jsdoc
    updateName() {
      const {newName} = this.state;
      const {cookies, currentForm} = this.props;

      const body = {
        form_id: currentForm.id,
        form_name: newName,
      };
      fetch(apiUrl() + '/updateFormName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.get('token')}`,
        },
        body: JSON.stringify(body),
      }).then((response) => {
        if (response.status === 200) {
          this.setState({
            openSuccessMessage: true,
          });
        } else {
          this.setState({
            openFailureMessage: true,
          });
        }
      }).catch((error) => {
        this.setState({
          openFailureMessage: true,
        });
      });
    }

    // eslint-disable-next-line require-jsdoc
    render() {
      const {setViewForm, currentForm} = this.props;
      const {blankFormData, newName, openSuccessMessage, openFailureMessage}= this.state;
      return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{minWidth: 650, marginTop: 10}}>
            <Button
              style={{marginBottom: 20}}
              onClick={() => setViewForm(false)}
              variant='contained'
            >
              Back
            </Button>
            <Paper elevation={2} style={{padding: 20}}>
              <div style={{paddingBottom: 10, fontSize: 25}}>
                Form Preview
              </div>
              <div style={{display: 'flex', alignItems: 'center', alignContent: 'center'}}>
                <div style={{fontSize: 15, marginRight: 10}}>
                  Form Name:
                </div>
                <TextField onChange={(e) => {
                  this.setState({newName: e.target.value});
                }}
                id="name-field"
                value={newName}
                inputProps={textSize}
                style={{marginRight: 10}}
                >
                </TextField>
                <Button
                  variant='contained'
                  disabled={currentForm.name === newName}
                  onClick={() => this.updateName()}>Update Name</Button>
              </div>
              {blankFormData !== null ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingBottom: 40}}>
                  <Paper elevation={2} style={{padding: 40, minWidth: 650, marginTop: 30}}>
                    <ReactFormGenerator
                      download_path=""
                      onSubmit={() => {}}
                      answer_data={{}}
                      read_only={true}
                      data={blankFormData}
                      action_name={'Cannot submit sample form'}
                    />
                  </Paper>
                </div>:
                <h1>Please select a form.</h1>
              }
            </Paper>
          </div>
          <SnackBarMessage
            open={openSuccessMessage}
            closeSnackbar={() => this.setState({openSuccessMessage: false})}
            message={'Form renamed.'}
            severity='success'
          />
          <SnackBarMessage
            open={openFailureMessage}
            closeSnackbar={() => this.setState({openFailureMessage: false})}
            message={'There was an error.'}
            severity='error'
          />
        </div>
      );
    }
}
export default withCookies(PreviewBlankForm);
