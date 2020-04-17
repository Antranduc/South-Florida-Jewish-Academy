/* eslint-disable max-len */
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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ModeCommentIcon from '@material-ui/icons/ModeComment';

// eslint-disable-next-line require-jsdoc
class ResendForms extends React.Component {
  static propTypes = {
    studentId: Proptypes.string,
    blankForms: Proptypes.array,
    studentForms: Proptypes.array,
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    const {studentForms, blankForms} = this.props;
    const processedStudentForms = this.processStudentForms(studentForms);
    const processedBlankForms = this.processBlankForms(blankForms);
    const displayFormData = this.processDisplayFormData(processedStudentForms, processedBlankForms);
    const makeComments = this.makeBlankComments(blankForms);
    this.state = {
      studentId: props.studentId,
      studentForms: processedStudentForms,
      blankForms: processedBlankForms,
      forms: displayFormData,
      openDialog: false,
      dialogId: 0,
      dialogName: '',
      comments: makeComments,
      message: 'Please note the new changes made on your student\'s forms.',
    };
  }

  // eslint-disable-next-line require-jsdoc
  makeBlankComments(blankForms) {
    return blankForms.map((form) => ({
      id: form.id,
      comment: '',
    }));
  }
  // eslint-disable-next-line require-jsdoc
  processDisplayFormData(studentForms, blankForms) {
    const studentFormIds = studentForms.map((form) => (form.id));
    return blankForms.map((form) => ({
      id: form.id,
      name: form.name,
      checked: studentFormIds.includes(form.id),
      lastUpdated: studentFormIds.includes(form.id) ? studentForms.filter((studentForm) => studentForm.id === form.id)[0].lastUpdated : ' - Not Sent',
    }));
  }
  // eslint-disable-next-line require-jsdoc
  processStudentForms(forms) {
    return forms.map((form) => ({
      id: form.blank_forms_id,
      lastUpdated: form.last_updated ? form.last_updated : ' - Not Started',
    }));
  }

  // eslint-disable-next-line require-jsdoc
  processBlankForms(forms) {
    return forms.map((form) => ({
      id: form.id,
      name: form.name,
    }));
  }

  // eslint-disable-next-line require-jsdoc
  handleClose() {
    this.setState({
      openDialog: false,
      dialogId: 0,
    });
  }

  // eslint-disable-next-line require-jsdoc
  formFlipper(formID) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => (currForm.id === formID ? {id: currForm.id, name: currForm.name, checked: !currForm.checked, lastUpdated: currForm.lastUpdated} : currForm));
    this.setState({
      forms: newForms,
    });
  }

  // eslint-disable-next-line require-jsdoc
  selectAll(theBool) {
    const oldForms = this.state.forms;
    // eslint-disable-next-line max-len
    const newForms = oldForms.map((currForm) => ({id: currForm.id, name: currForm.name, checked: theBool, lastUpdated: currForm.lastUpdated}));
    this.setState({
      forms: newForms,
    });
  }

  // eslint-disable-next-line require-jsdoc
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
  getComment(id){
    const {comments} = this.state;
    const theComment = comments.filter((comment) => comment.id === id)
    return theComment.length === 1 ? theComment[0].comment : '';
  }
  hasComment(id){
    const {comments} = this.state;
    const theComment = comments.filter((comment) => comment.id === id)
    return theComment.length === 1 && theComment[0].comment !== '';
  }
  deleteAndClose(id){
    this.updateComment(id, '');
    this.setState({
      openDialog: false,
      dialogId: 0,
    });
  }
  updateMessage(newMessage){
    this.setState({
      message: newMessage,
    });
  }
  // eslint-disable-next-line require-jsdoc
  render() {
    const {forms, openDialog, dialogId, dialogName, message} = this.state;
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
                                this.setState({openDialog: true, dialogId: value.id, dialogName: value.name});
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
              <Paper elevation={3} style={{display: 'flex', margin: 10, flexDirection: 'column'}}>
                <div style={{display: 'flex', marginTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'column'}}>
                  Optional Additional Message:
                </div>
                <div style={{display: 'flex', marginTop: 10, marginLeft: 10, marginRight: 10, flexDirection: 'column'}}>
                  <TextField
                    multiline
                    autoFocus
                    margin="dense"
                    id="message"
                    label="message"
                    type="text"
                    value={message}
                    onChange={(e) => this.updateMessage(e.target.value)}
                  />
                </div>
              </Paper>
            </div>
            <div style={{display: 'flex', justifyContent: 'right', alignItems: 'right', flexDirection: 'row-reverse', margin: 20}}>
              <Button variant='contained' size='large' onClick={()=> {}}>Submit</Button>
            </div>
          </Paper>
        </div>
        <Dialog open={openDialog} onClose={this.handleClose.bind(this)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Comment on {dialogName}</DialogTitle>
          <DialogContent>
              Write your comment here for {dialogName}:
            <TextField
              multiline
              autoFocus
              margin="dense"
              id="comment"
              label="comment"
              type="text"
              fullWidth
              value={this.getComment(dialogId)}
              onChange={(e) => this.updateComment(dialogId, e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.deleteAndClose.bind(this)(dialogId)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withCookies(ResendForms);

