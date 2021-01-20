import React, { Component, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';


const columns = [
  {
    title: 'Test Template ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Creation Date',
    dataIndex: 'created',
    key: 'created',
  }
];

class MainPageContent extends Component {
  componentDidMount() {
    const { getTest } = this.props;
    this.debouncedSearch = debounce(testId => getTest(testId), 500);
  }

  onSearchChange = e => {
    e.persist();
    this.debouncedSearch(e.target.value);
  }

  render() {
    const { testTemplate, history, location } = this.props;
    const data = [];
    if (testTemplate) {
      data.push({
        key: testTemplate.ID,
        id: testTemplate.ID,
        name: testTemplate.Name,
        created: '2020 - 09 - 01'
      });
    }
    return (
      <Space direction="vertical" size='middle' style={{ 'width': '100%' }}>
        <Input
          placeholder="input search text"
          prefix={<SearchOutlined />}
          size="middle"
          onChange={this.onSearchChange}
        />
        <Table
          columns={columns}
          dataSource={data}
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                history.push(`test-template-details/${record.id}`, {from: location.pathname});
              }
            };
          }}
        />
      </Space>
    );
  }
}

MainPageContent.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTest: PropTypes.func.isRequired,
  testTemplate: PropTypes.object,
};

export default MainPageContent;
