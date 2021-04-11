import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Date extends Component {
  render() {
    const { date } = this.props;
    var data = moment.unix(date).format('h:mm:ss a, MM-DD-YY')

    console.log(new Date(date), data);

    return (
        <div>{data}</div>
    );
  }
}

Date.propTypes = {
  date: PropTypes.string.isRequired,
};

export default Date;