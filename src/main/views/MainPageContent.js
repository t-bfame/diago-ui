import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input, Table, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import Test from '../../model/test';
import moment from 'moment';


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

const MainPageContent = connect(state => ({
  tests: state.model.tests
}))(class MainPageContent extends Component {
  constructor(props){
    super(props);
    this.state = {
      testIds: [],
    };
  }

  componentDidMount() {
    this.debouncedSearch = debounce(testId => {
      if (testId) {
        Test.forPrefix(testId).then(r => {
          this.setState({testIds: r.docs.map(doc => doc.ID)})
        }).catch(() => {
          this.setState({testIds: []})
        });
      } else {
        // empty search - clear table
        this.setState({testIds: []})
      }
    }, 500);
  }

  onSearchChange = e => {
    e.persist();
    this.debouncedSearch(e.target.value);
  }

  render() {
    const { history, location, tests } = this.props;
    const { testIds } = this.state;
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
          dataSource={
            testIds
              .map(id => tests.get(id))
              .map(test => ({
                key: test.ID,
                id: test.ID,
                name: test.Name,
                created: moment().format('YYYY-MM-DD'),
              }))}
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
});

MainPageContent.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default MainPageContent;
