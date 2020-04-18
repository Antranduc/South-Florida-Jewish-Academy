/* eslint-disable max-len,require-jsdoc */
import React from 'react';
import Proptypes, {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import {Button, Checkbox, List, ListItem, ListItemIcon, Paper} from '@material-ui/core';
import CommentIcon from '@material-ui/icons/Comment';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ModeCommentIcon from '@material-ui/icons/ModeComment';
import apiUrl from '../../utils/Env';
import ConfirmationDialog from './ConfirmationDialog';
import MessageBox from './MessageBox';

// eslint-disable-next-line require-jsdoc
class ResendForms extends React.Component {
  static propTypes = {
    studentId: Proptypes.string,
    blankForms: Proptypes.array,
    studentForms: Proptypes.array,
    cookies: instanceOf(Cookies).isRequired,
    parents: Proptypes.array,
  };

  constructor(props) {
    super(props);
    const {studentForms, blankForms} = this.props;
    const processedStudentForms = this.processStudentForms(studentForms);
    const processedBlankForms = this.processBlankForms(blankForms);
    const displayFormData = this.processDisplayFormData(processedStudentForms, processedBlankForms);
    const makeComments = this.makeBlankComments(blankForms);
    this.state = {
      studentForms: processedStudentForms,
      blankForms: processedBlankForms,
      forms: displayFormData,
      openCommentDialog: false,
      dialogCommentId: 0,
      dialogCommentName: '',
      openConfirmationDialog: false,
      comments: makeComments,
      message: 'Please note the new changes made on your student\'s forms.\n\nThank you for your attention.',
    };
  }
  setOpenConfirmationDialog(newBool) {
    this.setState({
      openConfirmationDialog: newBool,
    });
  }
  resendForms() {
    const {comments, message, forms} = this.state;
    const {studentId, cookies} = this.props;
    const body = {
      comments: comments,
      message: message,
      id: studentId,
      forms: forms,
    };
    fetch(apiUrl() + '/resendForms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then(() => {});
  }
  makeBlankComments(blankForms) {
    return blankForms.map((form) => ({
      id: form.id,
      comment: '',
    }));
  }
  processDisplayFormData(studentForms, blankForms) {
    const studentFormIds = studentForms.map((form) => (form.id));
    return blankForms.map((form) => ({
      id: form.id,
      name: form.name,
      checked: studentFormIds.includes(form.id),
      lastUpdated: studentFormIds.includes(form.id) ? studentForms.filter((studentForm) => studentForm.id === form.id)[0].lastUpdated : ' - Not Sent',
    }));
  }
  processStudentForms(forms) {
    return forms.map((form) => ({
      id: form.blank_forms_id,
      lastUpdated: form.last_updated ? form.last_updated : ' - Not Started',
    }));
  }
  processBlankForms(forms) {
    return forms.map((form) => ({
      id: form.id,
      name: form.name,
    }));
  }
  handleCommentClose() {
    this.setState({
      openCommentDialog: false,
      dialogCommentId: 0,
    });
  }
  formFlipper(formID) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => (currForm.id === formID ? {id: currForm.id, name: currForm.name, checked: !currForm.checked, lastUpdated: currForm.lastUpdated} : currForm));
    this.setState({
      forms: newForms,
    });
  }
  selectAll(theBool) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => ({id: currForm.id, name: currForm.name, checked: theBool, lastUpdated: currForm.lastUpdated}));
    this.setState({
      forms: newForms,
    });
  }

  updateComment(dialogId, newComment) {
    const {comments} = this.state;
    const newComments = comments.map((curr) => ({
      id: curr.id,
      comment: curr.id === dialogId ? newComment : curr.comment,
    }));
    this.setState({
      comments: newComments,
    });
  }
  getComment(id) {
    const {comments} = this.state;
    const theComment = comments.filter((comment) => comment.id === id);
    return theComment.length === 1 ? theComment[0].comment : '';
  }
  hasComment(id) {
    const {comments} = this.state;
    const theComment = comments.filter((comment) => comment.id === id);
    return theComment.length === 1 && theComment[0].comment !== '';
  }
  deleteAndClose(id) {
    this.updateComment(id, '');
    this.setState({
      openCommentDialog: false,
      dialogCommentId: 0,
    });
  }
  updateMessage(newMessage) {
    this.setState({
      message: newMessage,
    });
  }

  render() {
    const {forms, openCommentDialog, dialogCommentId, dialogCommentName, message, openConfirmationDialog} = this.state;
    const {parents} = this.props;
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 40}}>
          <Paper elevation={2} style={{padding: 10}}>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: 10}}>
              <Paper elevation={3} style={{display: 'flex', margin: 10}}>
                <div style={{width: 300}}>
                  <List>
                    {/* eslint-disable-next-line max-len */}
                    <ListItem key={'select_all'} role={undefined} dense button onClick={() => {
                      this.selectAll(!forms.every((currForm) => currForm.checked));
                    }}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={forms.every((currForm) => currForm.checked)}
                          tabIndex={-1}
                          disableRipple
                          // inputProps={{'aria-labelledby': labelId}}
                        />
                      </ListItemIcon>
                      Select All
                    </ListItem>
                    {forms.map((value) => {
                      const labelId = `checkbox-list-label-${value}`;
                      return (
                        // eslint-disable-next-line max-len
                        <ListItem key={value.id} role={undefined} dense button onClick={() => {
                          this.formFlipper(value.id);
                        }}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={value.checked}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{'aria-labelledby': labelId}}
                            />
                          </ListItemIcon>
                          {value.name}{value.lastUpdated}
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() => {
                                this.setState({openCommentDialog: true, dialogCommentId: value.id, dialogCommentName: value.name});
                              }}
                            >
                              {this.hasComment(value.id) ? <CommentIcon/> : <ModeCommentIcon/>}
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                </div>
              </Paper>
              <br/>
              <MessageBox message={message} updateMessage={this.updateMessage.bind(this)}/>
            </div>
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'right', flexDirection: 'row-reverse', margin: 20}}>
              <Button variant='contained' size='large' onClick={() => this.setState({openConfirmationDialog: true})}>Send Email</Button>
            </div>
          </Paper>
        </div>
        <Dialog open={openCommentDialog} onClose={this.handleCommentClose.bind(this)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Comment on {dialogCommentName}</DialogTitle>
          <DialogContent>
              Write your comment here for {dialogCommentName}:
            <TextField
              multiline
              autoFocus
              margin="dense"
              id="comment"
              label="comment"
              type="text"
              fullWidth
              value={this.getComment(dialogCommentId)}
              onChange={(e) => this.updateComment(dialogCommentId, e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.deleteAndClose.bind(this)(dialogCommentId)} variant="contained">
              Delete
            </Button>
            <Button onClick={this.handleCommentClose.bind(this)} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <ConfirmationDialog
          parents={parents}
          setOpenConfirmationDialog={this.setOpenConfirmationDialog.bind(this)}
          openConfirmationDialog={openConfirmationDialog}
          resendForms={this.resendForms.bind(this)}/>
      </div>
    );
  }
}

export default withCookies(ResendForms);

