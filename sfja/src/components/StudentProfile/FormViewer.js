/* eslint-disable max-len,react/prop-types */
import React from 'react';
import {withAuth0} from '../../utils/Auth0Wrapper';
import apiUrl from '../../utils/Env';
import ProfileHeader from './ProfileHeader';
import {ReactFormGenerator} from 'react-form-builder2';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ConfirmationDialog from '../../utils/ConfirmationDialog';
import MuiAlert from '@material-ui/lab/Alert';
import {CircularProgress} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import SnackBarMessage from '../../utils/SnackBarMessage';

// eslint-disable-next-line require-jsdoc
class FormViewer extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      formData: [],
      blankFormData: null,
      basicInfo: null,
      parentProfile: null,
      formInfo: null,
      openDialog: false,
      openDialogReset: false,
      edit: false,
      openSnackBar: false,
      openSnackBarStatus: false,
      success: false,
      success2: false,
      formStatus: false,
      authorized: false,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {token} = this.props;
    const body = {
      student_id: this.props.match.params.studentId,
      form_id: this.props.match.params.formId,
    };

    fetch(apiUrl() + '/studentProfileForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).then((res) => res.json())
        .then((data) => {
          this.setState({
            formData: data.form_data,
            blankFormData: data.blank_form_data,
            basicInfo: data.basic_info,
            parentProfile: data.parent_profile,
            formInfo: data.form_info,
            formStatus: data.form_info.completed,
            authorized: data.isAuthorized,
          });
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  // eslint-disable-next-line require-jsdoc
  setOpenDialog(newBool) {
    this.setState({openDialog: newBool});
  }
  // eslint-disable-next-line require-jsdoc
  handleSubmit(data) {
    this.setState({
      formData: data,
      openDialog: true,
    });
  }
  // eslint-disable-next-line require-jsdoc
  handleSubmitForm() {
    const {formData} = this.state;
    const {token} = this.props;
    const body = {
      // eslint-disable-next-line react/prop-types
      form_id: this.props.match.params.formId,
      answer_data: formData,
    };
    fetch(apiUrl() + '/submitFormAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // eslint-disable-next-line react/prop-types
      body: JSON.stringify(body),
    }).then((response) => {
      console.log(response);
      if (response.status === 200) {
        this.setState({
          openSnackBar: true,
          success: true,
          formStatus: true,
        });
      } else {
        this.setState({
          openSnackBar: true,
          success: false,
        });
      }
    }).catch((error) => {
      this.setState({
        openSnackBar: true,
        success: false,
      });
    });
  }
  // eslint-disable-next-line require-jsdoc
  handleStatusChange() {
    const {token} = this.props;
    const {formStatus}= this.state;
    const body = {
      form_id: this.props.match.params.formId,
      form_status: formStatus,
    };

    fetch(apiUrl() + '/changeStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            formStatus: data.status,
            openSnackBarStatus: true,
            success2: true,
          });
          console.log(data.status);
        })
        .catch((error) => {
          console.error(error);
        });
  }

  // eslint-disable-next-line require-jsdoc
  handleReset() {
    const {token} = this.props;
    const body = {
      form_id: this.props.match.params.formId,
    };

    fetch(apiUrl() + '/resetForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            formInfo: data.new_form_info,
            formStatus: data.new_form_info.completed,
            formData: data.new_form_info.form_data,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    window.location.reload(false);
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {basicInfo, blankFormData, formData, formInfo, parentProfile, openDialog, openDialogReset, edit, success, success2, openSnackBar, openSnackBarStatus, authorized, formStatus} = this.state;
    if (!basicInfo) {
      return (
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
          <CircularProgress/>
        </div>
      );
    }
    return (
      <div>
        {basicInfo.archived ?
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <MuiAlert
              elevation={6}
              variant="filled"
              severity='error'
              style={{fontSize: 15, maxWidth: 1000, width: '100%'}}>
              This student is archived. Please ask the administrator to unarchive from the students page to make changes.
            </MuiAlert>
          </div> :
          null}
        {/* eslint-disable-next-line max-len */}
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: 1000, width: '100%', padding: 10}}>
            <Button
              style={{display: 'flex'}}
              className="button icon-left"
              variant="contained"
              onClick={() => this.props.history.goBack()}>
              Back
            </Button>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {basicInfo && <ProfileHeader basicInfo={basicInfo}/>}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{maxWidth: 1000, width: '100%', padding: 10}}>
            <Paper elevation={2} style={{padding: 10}}>
              {formInfo && parentProfile && <div style={{display: 'flex', flexDirection: 'column', padding: 20}}>
                <div style={{display: 'flex', fontSize: 16}}>
                  Form Name: {formInfo.name}
                </div>
                <div style={{display: 'flex', fontSize: 13}}>
                  Parent: {parentProfile.first_name} {parentProfile.last_name}
                  <br/>
                  Parent Email: {parentProfile.email}
                  <br/>
                  Last Updated: {formInfo.last_updated === null ? 'Never' : formInfo.last_updated}
                  <br/>
                  Status: {formStatus ? 'Complete' : 'Not Complete'}
                  <br/>
                </div>
              </div>}
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', backgroundColor: '#0068af', width: '95%', height: 2, marginTop: 10}}></div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                  <div style={{display: 'flex', paddingLeft: 20}}>
                    Mode: {edit ? 'edit' : 'read-only'}
                  </div>
                  <div style={{display: 'flex'}}>
                    <Switch
                      checked={edit}
                      disabled={!authorized}
                      onChange={(event) => {
                        if (!basicInfo.archived) {
                          this.setState({edit: event.target.checked});
                        }
                      }}
                      name='Turn on editing mode'
                      color="primary"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    margin: 20,
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      marginRight: 20,
                    }}
                  >
                    <Button
                      variant='contained'
                      disabled = {formStatus || !authorized}
                      style={{cursor: 'pointer'}}
                      onClick={()=> {
                        this.handleStatusChange();
                      }}
                    >
                        Mark as complete
                    </Button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      marginRight: 20,
                    }}
                  >
                    <Button
                      variant='contained'
                      style={{cursor: 'pointer'}}
                      disabled = {!formStatus || !authorized}
                      onClick={()=> {
                        this.handleStatusChange();
                      }}
                    >
                        Mark as incomplete
                    </Button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                    }}
                  >
                    <Button
                      variant='contained'
                      disabled={!authorized}
                      style={{cursor: 'pointer'}}
                      onClick={()=> {
                        this.setState({openDialogReset: true});
                      }}
                    >
                        Reset Form
                    </Button>
                  </div>
                </div>

              </div>

              {blankFormData !== null ?
                <Paper style={{padding: 20, margin: 20}} elevation={2}>
                  <ReactFormGenerator
                    onSubmit={(data) => {
                      if (!basicInfo.archived && edit) {
                        this.handleSubmit(data);
                      }
                    }}
                    answer_data={formData}
                    data={blankFormData}
                    read_only={basicInfo.archived || !edit}
                    action_name={basicInfo.archived ? 'This student is archived' : (edit ? 'Overwrite Parent\'s Data' : 'Read-only mode')}
                  />
                </Paper> :
               <div/>}
            </Paper>
          </div>
        </div>
        <ConfirmationDialog
          showWarning={openDialog}
          setShowWarning={this.setOpenDialog.bind(this)}
          onConfirm={this.handleSubmitForm.bind(this)}
          message='You are attempting to overwrite form data. Are you sure?'
          confirmMessage='Yes'
          notConfirmMessage='Back'
        />
        <ConfirmationDialog
          showWarning={openDialogReset}
          setShowWarning={(newVal) => this.setState({openDialogReset: newVal})}
          onConfirm={this.handleReset.bind(this)}
          message='You are attempting to erase ALL form data. Are you sure?'
          confirmMessage='Yes'
          notConfirmMessage='cancel'
        />
        <SnackBarMessage
          open={openSnackBar}
          closeSnackbar={() => this.setState({openSnackBar: false})}
          message={success ? 'Parent form data overwritten' : 'There was an error.'}
          severity={success ? 'success' : 'error'}
        />
        <SnackBarMessage
          open={openSnackBarStatus}
          closeSnackbar={() => this.setState({openSnackBarStatus: false})}
          message={success2 ? 'Form Status Successfully Changed' : 'There was an error.'}
          severity={success2 ? 'success' : 'error'}
        />
      </div>
    );
  }
}

export default withAuth0(FormViewer);
