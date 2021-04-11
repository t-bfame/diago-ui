import React, { Component } from 'react';
import moment from 'moment';

class Date extends Component {
  render() {
    const { date } = this.props;
    var data = moment.unix(date).format('h:mm:ss a, MM-DD-YY')

    return (
        <div>{data}</div>
    );
  }
}

Date.propTypes = {
};

export default Date;