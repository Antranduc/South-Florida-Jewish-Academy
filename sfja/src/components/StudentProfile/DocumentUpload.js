/* eslint-disable max-len,react/prop-types */
/* eslint-disable camelcase */
import React from 'react';
import apiUrl from '../../utils/Env';
import SnackBarMessage from '../../utils/SnackBarMessage';
import {Button} from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import {saveAs} from 'file-saver';
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationDialog from '../../utils/ConfirmationDialog';

const textSize = {
  fontSize: '13px',
};

// eslint-disable-next-line require-jsdoc
class DocumentUpload extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired,
  };

  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      files: null,
      files2: null,
      openSuccessMessage: false,
      openDeleteMessage: false,
      name: null,
      toDelete: null,
      openConfirmationDialog: false,
      success: false,
    };
  }
  // eslint-disable-next-line require-jsdoc
  componentDidMount() {
    const {cookies} = this.props;
    const {studentId} = this.props;
    fetch(apiUrl() + '/getFiles?studentId='+ studentId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
    })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            files2: data.files,
          });
        })
        .catch(console.log);
  }
  // eslint-disable-next-line require-jsdoc
  handleImageUpload() {
    const {cookies} = this.props;
    const {files}= this.state;
    const {studentId} = this.props;
    console.log(files);
    if (files === null || files.length !== 1 ) {
      return;
    }
    const formData = new FormData();
    console.log(files);
    formData.append('file', files[0]);

    fetch(apiUrl() + '/saveImage?studentId='+ studentId, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({
            files2: data.files,
            openSuccessMessage: true,
            name: null,
            success: true,
          });
        })
        .catch((error) => {
          this.setState({
            success: false,
            openSuccessMessage: true,
          });
          console.error(error);
        });
    // this.setState({openSuccessMessage: true, name: null});
  }
  // eslint-disable-next-line require-jsdoc
  downloadData(file_id, file_name) {
    const {cookies} = this.props;
    const body = {
      file_id: file_id,
      file_name: file_name,
    };
    fetch(apiUrl() + '/downloadFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    }).then((response) => (response.blob()))
        .then((blob) => {
          saveAs(blob, file_name);
        });
  }
  // eslint-disable-next-line require-jsdoc
  deleteData() {
    const {cookies} = this.props;
    const {studentId} = this.props;
    const body = {
      file_id: this.state.toDelete,
      studentId: studentId,
    };

    fetch(apiUrl() + '/deleteFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`,
      },
      body: JSON.stringify(body),
    })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({
            files2: data.files,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    this.setState({openDeleteMessage: true});
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    console.log(this.state);
    const {success, openSuccessMessage, openDeleteMessage, files, files2, name, openConfirmationDialog} = this.state;

    return (
      <div>
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
            }}>
            <Button
              variant='text'
              size="large"
              disabled='true'
            >
              {name}
            </Button>
          </div>

          <div
            style={{
              display: 'flex',
              marginRight: 20,
            }}>
            <Button
              variant="contained"
              component="label"
              size="large"
            >
              Choose File
              <input type="file" id="fileUpload" style={{display: 'none'}} onChange={(e)=>{
                this.setState({files: e.target.files, name: e.target.files[0].name});
              }}/>
            </Button>
          </div>


          <div
            style={{
              display: 'flex',
            }}>
            <Button component="label" variant="contained" size="large" disabled={files === null || files.length !== 1 }onClick={this.handleImageUpload.bind(this)}>
                      Add Document
            </Button>

          </div>
        </div>
        {files2 != null ? (
          <TableContainer component={Paper} style={{padding: 20}}>
            <Table size = 'large'>
              <TableHead>
                <TableRow >
                  <TableCell style={textSize} align = "left" >File Name</TableCell>
                  <TableCell style={textSize} align = "left" >File ID</TableCell>
                  <TableCell style={textSize} align = "center" >Download</TableCell>
                  <TableCell style={textSize} align = "center" >Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files2.map((file) => (
                  <TableRow key={file['file_id']}>
                    <TableCell style={textSize} align = "left">{file['file_name']}</TableCell>
                    <TableCell style={textSize} align = "left" >{file['file_id']}</TableCell>
                    <TableCell style={textSize} align = "center" >
                      <Button
                        variant='contained'
                        style={{cursor: 'pointer'}}
                        onClick={()=> {
                          this.downloadData(file['file_id'], file['file_name']);
                        }}
                      >
                        <CloudDownloadIcon fontSize='large'/>
                      </Button>
                    </TableCell>
                    <TableCell style={textSize} align = "center" >
                      <Button
                        variant='contained'
                        style={{cursor: 'pointer'}}
                        onClick={()=> {
                          this.setState({toDelete: file['file_id'], openConfirmationDialog: true});
                        }}
                      >
                        <DeleteIcon fontSize='large'/>
                      </Button></TableCell>
                  </TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
        ): null
        }

        <ConfirmationDialog
          showWarning={openConfirmationDialog}
          setShowWarning={(newVal) => this.setState({openConfirmationDialog: newVal})}
          onConfirm={this.deleteData.bind(this)}
          message={'Are you sure you want to delete this file? This operation cannot be undone.'}
          confirmMessage='delete'
          notConfirmMessage='cancel'
        />

        <SnackBarMessage
          open={openSuccessMessage}
          closeSnackbar={() => this.setState({openSuccessMessage: false})}
          message={success ? 'File Successfully Uploaded' : 'Error with Upload'}
          severity={success ? 'success' : 'error'}
        />

        <SnackBarMessage
          open={openDeleteMessage}
          closeSnackbar={() => this.setState({openDeleteMessage: false})}
          message={'File Successfully Deleted'}
          severity='success'
        />

      </div>

    );
  }
}

export default withCookies(DocumentUpload);
