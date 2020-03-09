import React from 'react';
import store from './FormBuilder/stores/store';
import {post} from './FormBuilder/stores/requests';

// eslint-disable-next-line require-jsdoc
export default class Demobar extends React.Component {
  // eslint-disable-next-line require-jsdoc
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };

    const update = this._onChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);

    // eslint-disable-next-line arrow-parens
    store.subscribe(state => (update(state.data)));
  }

  // eslint-disable-next-line require-jsdoc
  _onChange(data) {
    this.setState({
      data,
    });
  }

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line require-jsdoc
  _onSubmit(data) {
    post('http://127.0.0.1:5000/newform', data);
    // Place code to post json data to server here
  }

  // eslint-disable-next-line require-jsdoc
  render() {
    return (
      <div className="clearfix" style={{margin: '10px', width: '70%'}}>
        <h4 className="pull-left">Preview</h4>
        <button className="btn btn-primary pull-right" style={{marginRight:
          // eslint-disable-next-line max-len
          '10px'}} onClick={() => this._onSubmit(this.state.data)}>Submit Form</button>
      </div>
    );
  }
}