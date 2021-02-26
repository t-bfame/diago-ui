import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  PageHeader,
  Button,
  Typography,
  Table,
  Space,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Card,
  Descriptions,
  Collapse,
} from 'antd';
import moment from 'moment';

import Page from '../../common/views/Page';
import Test from '../../model/test';
import TestInstance from '../../model/test-instance';
import TestSchedule from '../../model/test-schedule';

import '../styles/index.css';

const { Title } = Typography;
const { Panel } = Collapse;

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
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
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
    title: 'Schedule ID',
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: 'Test Template ID',
    dataIndex: 'TestID',
    key: 'TestID',
  },
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: 'CronSpec',
    dataIndex: 'CronSpec',
    key: 'CronSpec',
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
  testSchedules: state.model['test-schedules'],
}))(class TestTemplateDetailsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submitTestModalVisible: false,
      submitTestModalLoading: false,
      testScheduleModalVisible: false,
      testScheduleModalLoading: false,
      instanceIds: [],
      scheduleIds: [],
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
      this.setState({
        instanceIds: docs.sort(({ CreatedAt: c1 }, { CreatedAt: c2 }) => c2 - c1).map(d => d.ID),
      });
    });
    TestSchedule.forTestId(id).then(({ docs }) => {
      this.setState({scheduleIds: docs.map(d => d.ID)});
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
          instanceIds: docs.sort(({ CreatedAt: c1 }, { CreatedAt: c2 }) => c2 - c1).map(d => d.ID),
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
    const { docs } = await TestSchedule.forTestId(test.ID);
    console.log(response);
    this.setState({
      scheduleIds: docs.map(doc => doc.ID),
      testScheduleModalLoading: false,
      showTestScheduleModal: false,
    });
  }

  handleCreateTestScheduleModalCancel = () => {
    this.setState({showTestScheduleModal: false});
    this.testScheduleModalFormRef.current.resetFields();
  }

  handleRowClick = (e, record) => {
    const { history, location } = this.props;
    if (record.status === "Done") {
      history.push(`/test-instance-details/${record.id}`, {from: location.pathname});
    }
  }

  testScheduleModalFormRef = React.createRef();

  render() {
    const { location, match, test, testInstances, testSchedules } = this.props;
    const {
      submitTestModalVisible, submitTestModalLoading, instanceIds, scheduleIds, showTestScheduleModal,
    } = this.state;
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

    const testInstanceData = instanceIds
      .map(id => testInstances.get(id))
      .map(instance => ({
        key: instance.ID,
        id: instance.ID,
        name: instance.TestID,
        type: instance.Type,
        created: moment.unix(instance.CreatedAt).format('YYYY-MM-DD'),
        status: instance.Status.charAt(0).toUpperCase() + instance.Status.slice(1),
      }));
    
    let jobPanels = null;
    if (test) {
      jobPanels = test.Jobs.map((job, idx) => {
        return (
          <Panel header={`Job ${job.Name}`} key={`${idx}`}>
            <Descriptions>
              <Descriptions.Item label="HTTP Method">{job.HTTPMethod}</Descriptions.Item>
              <Descriptions.Item label="HTTP Url">{job.HTTPUrl}</Descriptions.Item>
              <Descriptions.Item label="Group">{job.Group}</Descriptions.Item>
              <Descriptions.Item label="Frequency">{job.Frequency}</Descriptions.Item>
              <Descriptions.Item label="Duration">{job.Duration}</Descriptions.Item>
            </Descriptions>
          </Panel>
        )
      });
    }

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
                  onRow={(record, rowIndex) => {
                    return {onClick: e => this.handleRowClick(e, record)};
                  }}
                />
              </div>
              <div>
                <Title type="secondary" level={4}>
                  Configs
                </Title>
                <Card
                  size='small'
                  style={{ width: '100%' }}
                  className='test-template-basic-info'
                >
                  <Descriptions>
                    <Descriptions.Item label="Name">{test.Name}</Descriptions.Item>
                    <Descriptions.Item label="Number of jobs">{test.Jobs.length}</Descriptions.Item>
                    <Descriptions.Item label="Creation date">2020 - 09 - 01</Descriptions.Item>
                  </Descriptions>
                </Card>
                <Collapse bordered={false}>
                  {jobPanels}
                </Collapse>
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
                  dataSource={
                    scheduleIds
                      .map(id => testSchedules.get(id))
                      .map(s => Object.assign({}, s, {key: s.ID}))
                  }
                />
              </div>
            </Space>
          )}
          currentPage="/tests"
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
              <Input placeholder='Name of test schedule' />
            </Form.Item>
            <Form.Item
              name="cronspec"
              label="Cron Spec"
              rules={[{ required: true, message: 'Please enter a valid cronspec' }]}
            >
              <Input placeholder='* * * * *' />
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
