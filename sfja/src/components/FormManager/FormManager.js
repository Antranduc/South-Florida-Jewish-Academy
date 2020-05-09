/* eslint-disable max-len */
import React from 'react';
import BlankFormBuilder from './BlankFormBuilder/BlankFormBuilder';
import PreviewBlankForm from './PreviewBlankForm';
import PropTypes, {instanceOf} from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import {Cookies, withCookies} from 'react-cookie';
import apiUrl from '../../utils/Env';

const textSize = {
  fontSize: '13px',
};

// eslint-disable-next-line require-jsdoc
class FormManager extends React.Component {
  static propTypes = {
    formsList: PropTypes.any,
    cookies: instanceOf(Cookies).isRequired,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      createForm: false,
      currentForm: null,
      formsList: null,
      viewForm: false,
      showWarning: false,
      formToTrash: null,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    this.fetchData();
  }
  // eslint-disable-next-line require-jsdoc
  fetchData() {
    const {cookies} = this.props;
    fetch(apiUrl() + '/getBlankFormDetails', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.setState({formsList: data.forms});
        });
  }

  // eslint-disable-next-line require-jsdoc
  trashForm() {
    const {formToTrash} = this.state;
    const {cookies} = this.props;
    const body = {
      form_id: formToTrash,
    };
    fetch(apiUrl() + '/deleteBlankForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
      // eslint-disable-next-line arrow-parens
    })
        .then((res) => res.text())
        .then((res) => console.log(res))
        .then(() => {
          this.fetchData();
        });
  }

  // eslint-disable-next-line require-jsdoc
  setCreateForm(newCreateForm) {
    this.fetchData();
    this.setState({createForm: newCreateForm});
  }

  // eslint-disable-next-line require-jsdoc
  setViewForm(newViewForm) {
    this.fetchData();
    this.setState({viewForm: newViewForm});
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {createForm, viewForm, formsList, showWarning} = this.state;

    if (formsList === null) {
      return (
        <div>
          loading...
        </div>
      );
    }

    const result = Object.values(formsList);
    const allInfoArr = [];
    for (let i = 0; i < result.length; i++) {
      const form = {
        id: result[i].form_id,
        name: result[i].form_name,
        date: result[i].date_created,
      };
      allInfoArr.push(form);
    }
    return (
      <div style={{padding: 20}}>
        {createForm ? <BlankFormBuilder setCreateForm={this.setCreateForm.bind(this)} style={{width: '100%', maxWidth: 1000}}/>:
         viewForm ? <PreviewBlankForm currentForm={this.state.currentForm} setViewForm={this.setViewForm.bind(this)}/>:
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '100%', maxWidth: 700, marginTop: 10}}>
              <Button
                onClick= {() => this.setState({createForm: true})}
                variant="contained"
              >
                Add Form
              </Button>
              <div style={{paddingTop: 10}}>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell style={textSize} align="right">Date Created</TableCell>
                        <TableCell style={textSize} align="right">Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allInfoArr.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell style={{cursor: 'pointer', fontSize: '13px'}} component="th" scope="row"
                            onClick={() => this.setState({currentForm: row, viewForm: true})}>
                            {row.name}
                          </TableCell>
                          <TableCell style={textSize} align="right">{row.date}</TableCell>
                          <TableCell style={textSize} align="right">
                            <Button onClick={
                              () => {
                                this.setState({formToTrash: row.id, showWarning: true});
                              }
                            }>Delete</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        }
        <Dialog
          open={showWarning}
          onClose={() => {
            this.setState({showWarning: false});
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle style={{fontSize: 10}} id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
          <DialogContent>
            <DialogContentText style={{fontSize: 15, textAlign: 'left'}} id="alert-dialog-description">
              Are you sure you want to delete this form? Deleting forms in existence will cause serious bugs.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.setState({showWarning: false});
            }}
            color='#0068af'
            variant='contained'
            style={{fontSize: 12}}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              this.setState({showWarning: false});
              this.trashForm();
            }} color='#0068af'
            autoFocus
            variant='contained'
            style={{fontSize: 12}}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withCookies(FormManager);
