/* eslint-disable max-len,react/prop-types */
import React from 'react';
import {ReactFormGenerator, ElementStore} from 'react-form-builder2';
import {Button, TextField} from '@material-ui/core';
import apiUrl from '../../../utils/Env';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {withAuth0} from '../../../utils/Auth0Wrapper';

// eslint-disable-next-line require-jsdoc
function post(url, data, token, formName, formYear, formTag) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: data,
      formName: formName,
      formYear: formYear,
      formTag: formTag,
    }),
    // eslint-disable-next-line arrow-parens
  }).then(response => response);
}

// eslint-disable-next-line require-jsdoc
class DemoBar extends React.Component {
  static propTypes = {
    setCreateForm: PropTypes.func,
    openSuccessSnackBar: false,
  };
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
      formName: this.props.blankFormName || '',
      formYear: '',
      formTag: '',
    };

    const update = this._onChange.bind(this);
    ElementStore.subscribe((state) => update(state.data));
  }

  // eslint-disable-next-line require-jsdoc
  showPreview() {
    this.setState({
      previewVisible: true,
    });
  }

  // eslint-disable-next-line require-jsdoc
  closePreview() {
    this.setState({
      previewVisible: false,
    });
  }

  // eslint-disable-next-line require-jsdoc
  _onChange(data) {
    this.setState({
      data,
    });
  }

  // eslint-disable-next-line require-jsdoc
  _onSubmit(data, formName, formYear, formTag) {
    const {token} = this.props;
    post(apiUrl() + '/newform', data, token, formName, formYear, formTag).then(() => {
      this.setState({formName: '', data: [], openSuccessSnackBar: true});
    });
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    const {formName, formYear, formTag, openSuccessSnackBar} = this.state;
    let modalClass = 'modal';
    if (this.state.previewVisible) {
      modalClass += ' show';
    }
    return (
      <div className="clearfix" style={{margin: '10px', width: '70%'}}>
        <TextField
          error={formName === ''}
          onChange={(ev) => this.setState({formName: ev.target.value})}
          value={formName}
          variant='outlined'
          id="standard-basic"
          label="Form Name"
          required={true}
        />
        <TextField
          error={formYear === ''}
          onChange={(ev) => this.setState({formYear: ev.target.value})}
          value={formYear}
          variant='outlined'
          id="standard-basic"
          label="School Year"
          required={true}
        />
        <TextField
          error={formTag === ''}
          onChange={(ev) => this.setState({formTag: ev.target.value})}
          value={formTag}
          variant='outlined'
          id="standard-basic"
          label="Form Tag"
          required={true}
        />
        <Button className="btn btn-primary pull-right"
          style={{marginRight: '10px', marginTop: 10}}
          variant='contained'
          onClick={() => this._onSubmit(this.state.data, formName, formYear, formTag)}
          disabled={formName === '' || formYear === '' || formTag === '' ||this.state.data.length === 0}
        >
          Add Form
        </Button>

        { this.state.previewVisible &&
        <div className={modalClass}>
          <div className="modal-dialog">
            <div className="modal-content">
              <ReactFormGenerator
                download_path=""
                answer_data={{}}
                onSubmit={() => {}}
                data={this.state.data} />

              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</button>
              </div>
            </div>
          </div>
        </div>
        }
        <Snackbar
          open={openSuccessSnackBar}
          autoHideDuration={1000}
          onClose={() => {
            this.setState({openSuccessSnackBar: false});
            this.props.history.goBack();
          }}>
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => {
              this.setState({openSuccessSnackBar: false});
            }}
            severity="success"
            style={{fontSize: 15}}>
            Saved.
          </MuiAlert>
        </Snackbar>
      </div>
    );
  }
}

export default withAuth0(DemoBar);
