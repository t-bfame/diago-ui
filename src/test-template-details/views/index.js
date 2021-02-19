import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageHeader, Button, Typography, Table, Space, Form, Input, Modal } from 'antd';
import moment from 'moment';

import Page from '../../common/views/Page';
import Test from '../../model/test';
import TestInstance from '../../model/test-instance';

const { Title } = Typography;

const testInstanceTableColumns = [
  {
    title: 'Test Instance ID',
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
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  }
];

const testSchedulesTableColumns = [
  {
    title: 'Test Template ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Scheduled time',
    dataIndex: 'time',
    key: 'time',
  }
];

const TestTemplateDetailsPage = connect((state, { match: { params: {id} } }) => ({
  test: state.model.tests?.get(id),
  testInstances: state.model['test-instances'],
}))(class TestTemplateDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalConfirmLoading: false,
      instanceIds: new Set(),
    };
  }

  componentDidMount() {
    const { history, match: { params: {id} }, test } = this.props;
    if (!test) {
      Test.get(id).catch(() => {
        history.replace('/404');
      });
    }
    TestInstance.forTestId(id).then(({ docs }) => {
      this.setState({instanceIds: new Set(docs.map(d => d.ID))});
    });
  }

  handleOk = () => {
    const { test } = this.props;
    this.setState({
      modalConfirmLoading: true,
    });

    test.start().then(() => {
      TestInstance.forTestId(test.ID).then(({ docs }) => {
        this.setState({
          modalConfirmLoading: false,
          modalVisible: false,
          instanceIds: new Set(docs.map(d => d.ID)),
        });
      });
    });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    const { location, match, test, testInstances } = this.props;
    const { modalVisible, modalConfirmLoading, instanceIds } = this.state;
    const { id } = match.params;
    console.log('Id of test template is:', id);
    console.log('Test template:', test);
    console.log('Test instances:', testInstances);

    const headerProps = {
      className: "site-page-header",
      title: "Test Template Details",
      subTitle: "manage everything related to a test template!",
      extra: (
        <Button key="1" type="primary" onClick={() => {
          this.setState({
            modalVisible: true,
          });
        }}>
          Start Test Instance
        </Button>
      ),
    };

    const header = location.state
      ? (
        <PageHeader
          {...headerProps}
          onBack={() => window.history.back()}
        />
      ) : <PageHeader {...headerProps} backIcon={false} />

    const testInstanceData = [...(testInstances || [])]
      .filter(([id,]) => instanceIds.has(id))
      .map(([,instance]) => ({
        key: instance.ID,
        id: instance.ID,
        name: instance.TestID,
        created: moment.unix(instance.CreatedAt).format('YYYY-MM-DD'),
        status: instance.Status.charAt(0).toUpperCase() + instance.Status.slice(1),
      }));

    return (
      <div>
        <Page
          CustomPageHeader={header}
          CustomPageContent={test === undefined ? <></> : (
            <Space direction="vertical" size='middle' style={{ 'width': '100%' }}>
              <div>
                <Title type="secondary" level={4}>
                  Test Instances
                </Title>
                <Table
                  columns={testInstanceTableColumns}
                  dataSource={testInstanceData}
                />
              </div>
              <div>
                <Title type="secondary" level={4}>
                  Configs
                </Title>
                <Form
                  labelCol={{
                    span: 4,
                  }}
                  wrapperCol={{
                    span: 8,
                  }}
                  name="basic"
                  labelAlign="left"
                  initialValues={{
                    id: test.ID,
                    name: test.Name,
                  }}
                >
                  <Form.Item
                    label="ID"
                    name="id"
                  >
                    <Input
                      disabled
                    />
                  </Form.Item>
                  <Form.Item
                    label="Name"
                    name="name"
                  >
                    <Input
                      disabled
                    />
                  </Form.Item>
                </Form>
              </div>
              <div>
                <Title type="secondary" level={4}>
                  Test Schedule
                </Title>
                <Table
                  columns={testSchedulesTableColumns}
                />
              </div>
            </Space>
          )}
        />
        <Modal
          title="Title"
          visible={modalVisible}
          onOk={this.handleOk}
          confirmLoading={modalConfirmLoading}
          onCancel={this.handleCancel}
        >
          <p>Are you sure you want to start a new test instance?</p>
        </Modal>
      </div>
    );
  }
});

TestTemplateDetailsPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default TestTemplateDetailsPage;
