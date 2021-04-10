import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge }  from 'antd';

class Status extends Component {
  render() {
    const { text } = this.props;
    let status = "default";
    switch (text) {
        case "done":
            status = "success";
            break;
        case "submitted":
            status = "processing";
            break;
        case "failed":
            status = "error";
            break;
    }
    
    return (
        <Badge status={status} text={text} />
    );
  }
}

Status.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Status;
