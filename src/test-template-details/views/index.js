import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PageHeader, Button, Typography, Table, Space, Form, Input, Modal } from 'antd';
import moment from 'moment';

import Page from '../../common/views/Page';
import { getTestInstances, startTest } from '../actions';

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

class TestTemplateDetailsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalConfirmLoading: false,
    };
  }

  async componentDidMount() {
    const { testTemplate, getTestInstances } = this.props;
    // TODO: send api request if testTemplate is null
    // (if the user directly goes to this url without coming here from the test templates page UI)
    if (testTemplate) {
      await getTestInstances(testTemplate.ID);
    }
  }

  handleOk = () => {
    this.setState({
      modalConfirmLoading: true,
    });

    const { testTemplate, getTestInstances, startTest } = this.props;
    startTest(testTemplate.ID).then(() => {
      this.setState({
        modalConfirmLoading: false,
        modalVisible: false,
      });
    });
  }

  handleCancel = () => {
    this.setState({
      modalVisible: false
    });
  }

  render() {
    const { location, match, testTemplate, testInstances } = this.props;
    const { modalVisible, modalConfirmLoading } = this.state;
    const { id } = match.params;
    console.log('Id of test template is:', id);
    console.log('Test template:', testTemplate);
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
      ) : <PageHeader {...this.headerProps} backIcon={false} />

    const testInstanceData = [];
    (testInstances || []).forEach(instance => {
      const status = instance.Status;
      testInstanceData.push({
        key: instance.ID,
        id: instance.ID,
        name: instance.TestID,
        created: moment.unix(instance.CreatedAt).format('YYYY-MM-DD'),
        status: status.charAt(0).toUpperCase() + status.slice(1),
      });
    })

    return (
      <div>
        <Page
          CustomPageHeader={header}
          CustomPageContent={
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
                    id: testTemplate.ID,
                    name: testTemplate.Name,
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
          }
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
}

TestTemplateDetailsPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  getTestInstances: PropTypes.func.isRequired,
  startTest: PropTypes.func.isRequired,
  testTemplate: PropTypes.object,
  testInstances: PropTypes.array,
};

const mapStateToProps = ({ mainPageReducer, testTemplateDetailsPageReducer }) => ({
  testTemplate: mainPageReducer.testTemplate,
  testInstances: testTemplateDetailsPageReducer.testInstances,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTestInstances: getTestInstances,
  startTest: startTest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TestTemplateDetailsPage);
