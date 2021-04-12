import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  PageHeader,
  Button,
  Breadcrumb,
  Typography,
  Table,
  Space,
  Form,
  Input,
  Modal,
  Row,
  Col,
  Popover,
  Descriptions,
  Collapse,
  message,
} from 'antd';

import Page from '../../common/views/Page';
import Test from '../../model/test';
import TestInstance from '../../model/test-instance';
import TestSchedule from '../../model/test-schedule';
import Status from '../../common/views/Status';
import Graph from '../../common/views/Graph';
import Date from '../../common/views/Date';

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
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Start time',
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
        message.success("Test instance successfully started");
      });
    }).catch(err => {
      this.setState({
        submitTestModalLoading: false,
        submitTestModalVisible: false,
      });
      message.error("Failed to start test instance (" + err + ")");
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
    if (record.debugStatus === "done" || record.debugStatus === "submitted") {
      history.push(`/test-instance-details/${record.id}`, {from: location.pathname});
    }
  }

  goToCreateTestTemplatePage = (test) => {
    const { history } = this.props;
    const { Name, Jobs, Chaos } = test;
    console.log(test);
    let data = {
      name: Name,
      jobs: Jobs.map(job => {
        return {
          duration: job.Duration,
          frequency: job.Frequency,
          group: job.Group,
          httpmethod: job.HTTPMethod,
          httpurl: job.HTTPUrl,
          name: job.Name,
        };
      }),
      chaos: (Chaos || []).map(chaos => {
        let selectors = [];
        if (chaos.Selectors) {
          Object.keys(chaos.Selectors).forEach(key => {
            selectors.push({
              selector: key + ":" + chaos.Selectors[key]
            });
          });
        }
        return {
          count: chaos.Count,
          namespace: chaos.Namespace,
          selectors: selectors,
          timeout: chaos.Timeout,
        };
      }),
    };
    console.log(data);
    history.push('/create-test-template', {data: data});
  }

  testScheduleModalFormRef = React.createRef();

  render() {
    const { match, test, testInstances, testSchedules } = this.props;
    const {
      submitTestModalVisible, submitTestModalLoading, instanceIds, scheduleIds, showTestScheduleModal,
    } = this.state;
    const { id } = match.params;

    const breadcrumb = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {id}
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    const headerProps = {
      className: "site-page-header",
      title: breadcrumb,
      subTitle: "manage everything related to a test template!",
      extra: (
        <div>
          <Button key="1" type="primary" onClick={() => {
            this.setState({
              submitTestModalVisible: true,
            });
          }}>
            Start Test Instance
          </Button>
          <Button key="2" style={{"marginLeft": 14}} onClick={() => this.goToCreateTestTemplatePage(test)}>
            Edit Test Template
          </Button>          
        </div>
      ),
    };

    const testInstanceData = instanceIds
      .map(id => testInstances.get(id))
      .map(instance => ({
        key: instance.ID,
        id: instance.ID,
        name: instance.TestID,
        type: <Status text={instance.Type} />,
        created: <Date date={instance.CreatedAt.toString()} />,
        status: instance.Error ? <Popover placement="left" content={"Error: " + instance.Error}><div><Status text={instance.Status} /></div></Popover> : <Status text={instance.Status} />,
        debugStatus: instance.Status,
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
              <Descriptions.Item label="Frequency (reqs / s)">{job.Frequency}</Descriptions.Item>
              <Descriptions.Item label="Duration (s)">{job.Duration}</Descriptions.Item>
            </Descriptions>
          </Panel>
        )
      });
    }

    return (
      <div>
        <Page
          CustomPageHeader={
            <PageHeader
              {...headerProps} 
            />
          }
          CustomPageContent={test === undefined ? <></> : (
            <Space direction="vertical" size='large' style={{ 'width': '100%' }}>
              <Graph minimized={true} testId={id} />
              <div>
                <Title level={5}>
                  Executions
                </Title>
                <Table
                  size={"small"}
                  columns={testInstanceTableColumns}
                  locale={{"emptyText": "No test instances have been run"}}
                  pagination={{"defaultPageSize": 5, "pageSize": 5, "size": "small"}}
                  dataSource={testInstanceData}
                  onRow={(record, rowIndex) => {
                    return {onClick: e => this.handleRowClick(e, record)};
                  }}
                />
              </div>
              <div>
                <Row justify='space-between'>
                  <Col>
                    <Title level={5}>
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
                  size={"small"}
                  columns={testSchedulesTableColumns}
                  locale={{"emptyText": "No test schedules have been created"}}
                  pagination={{"defaultPageSize": 5, "pageSize": 5, "size": "small"}}
                  dataSource={
                    scheduleIds
                      .map(id => testSchedules.get(id))
                      .map(s => Object.assign({}, s, {key: s.ID}))
                  }
                />
              </div>
            </Space>
          )}
          currentPage="/"
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
