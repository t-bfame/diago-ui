import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  toggleLogin,
} from '../actions';

class MainPage extends Component {
  render() {
    return (
      <div className='mainpage-container'>
        <button onClick={() => {
          toggleLogin();          
        }}>
            Click me! 
        </button>
      </div>
    );
  }
}

MainPage.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  toggleLogin: PropTypes.func.isRequired,
};

const mapStateToProps = ({ mainPageReducer }) => ({
  loggedIn: mainPageReducer.loggedIn,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleLogin: toggleLogin,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
