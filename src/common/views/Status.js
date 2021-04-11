import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag }  from 'antd';
import {
  SyncOutlined,
} from '@ant-design/icons';

class Status extends Component {
  render() {
    const { text } = this.props;

    let status = text;
    let color = "geekblue";
    let showProcessing = false;

    switch (text) {
        case "done":
        case "success":
            status = "Success";
            color = "#87d068";
            break;
        case "submitted":
            status = "Processing";
            color = "#2db7f5";
            showProcessing = true;
            break;
        case "failed":
            status = "Error";
            color = "#f50";
            break;
        case "adhoc":
            status = "Adhoc";
            color = "blue";
			break;
		case "scheduled":
            status = "Scheduled";
            color = "blue";
	}
    
    return (
        <Tag icon={showProcessing ? <SyncOutlined spin /> : null} color={color}>{status}</Tag>
    );
  }
}

Status.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Status;
