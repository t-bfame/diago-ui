import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { PageHeader, Button, Typography, Table, Space, Form, Input, Modal, Row, Col } from 'antd';
import moment from 'moment';

import Page from '../../common/views/Page';
import Test from '../../model/test';
import TestInstance from '../../model/test-instance';
import TestSchedule from '../../model/test-schedule';

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

const testScheduleModalFormLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
}

const TestTemplateDetailsPage = connect((state, { match: { params: {id} } }) => ({
  test: state.model.tests?.get(id),
  testInstances: state.model['test-instances'],
}))(class TestTemplateDetailsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitTestModalVisible: false,
      submitTestModalLoading: false,
      instanceIds: new Set(),
      testScheduleModalVisible: false,
      testScheduleModalLoading: false,
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

  handleSubmitTest = () => {
    const { test } = this.props;
    this.setState({
      submitTestModalLoading: true,
    });

    test.start().then(() => {
      TestInstance.forTestId(test.ID).then(({ docs }) => {
        this.setState({
          submitTestModalLoading: false,
          submitTestModalVisible: false,
          instanceIds: new Set(docs.map(d => d.ID)),
        });
      });
    });
  }

  handleSubmitTestModalCancel = () => {
    this.setState({
      submitTestModalVisible: false
    });
  }

  handleCreateTestSchedule = () => {
    this.testScheduleModalFormRef.current
      .validateFields()
      .then(values => {
        this.createTestSchedule(values);
      })
      .catch(info => {
        console.log('Validate failed:', info);
      });
  }

  createTestSchedule = async({scheduleName, cronspec}) => {
    this.setState({
      testScheduleModalLoading: true,
    });
    const { test } = this.props;
    const response = await TestSchedule.create({
      Name: scheduleName,
      TestID: test.ID,
      CronSpec: cronspec,
    })
    console.log(response);
    this.setState({
      testScheduleModalLoading: false,
      showTestScheduleModal: false,
    });
  }

  handleCreateTestScheduleModalCancel = () => {
    this.setState({showTestScheduleModal: false});
    this.testScheduleModalFormRef.current.resetFields();
  }

  testScheduleModalFormRef = React.createRef();

  render() {
    const { location, match, test, testInstances } = this.props;
    const { submitTestModalVisible, submitTestModalLoading, instanceIds, showTestScheduleModal } = this.state;
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
            submitTestModalVisible: true,
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
            <Space direction="vertical" size='large' style={{ 'width': '100%' }}>
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
                <Row justify='space-between'>
                  <Col>
                    <Title type="secondary" level={4}>
                      Test Schedule
                    </Title>
                  </Col>
                  <Col>
                    <Button onClick={() => this.setState({showTestScheduleModal: true})} style={{ marginBottom: '0.5em' }}>
                      Create
                    </Button>
                  </Col>
                </Row>
                <Table
                  columns={testSchedulesTableColumns}
                />
              </div>
            </Space>
          )}
        />
        <Modal
          title="Please confirm"
          visible={submitTestModalVisible}
          onOk={this.handleSubmitTest}
          confirmLoading={submitTestModalLoading}
          onCancel={this.handleSubmitTestModalCancel}
        >
          <p>Are you sure you want to start a new test instance?</p>
        </Modal>
        <Modal
          visible={showTestScheduleModal}
          title="Create a New Test Schedule"
          okText="Create"
          cancelText="Cancel"
          onOk={this.handleCreateTestSchedule}
          onCancel={this.handleCreateTestScheduleModalCancel}
        >
          <Form
            {...testScheduleModalFormLayout}
            ref={this.testScheduleModalFormRef}
          >
            <Form.Item
              name="scheduleName"
              label="Name"
              rules={[{ required: true, message: 'Please enter the name of the test schedule' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="cronspec"
              label="Cron Spec"
              rules={[{ required: true, message: 'Please enter a valid cronspec' }]}
            >
              <Input />
            </Form.Item>
          </Form>
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
