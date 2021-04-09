import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, Button, Space, Typography, Descriptions, Badge, Card, Modal } from 'antd';
import moment from 'moment';

import {
  BarChartOutlined
} from '@ant-design/icons';

import Page from '../../common/views/Page';
import TestInstance from '../../model/test-instance';

const { Title } = Typography;

const TestInstanceDetailsPage = connect((state, { match: { params: {id} } }) => ({
  testInstances: state.model['test-instances'],
}))(class TestInstanceDetailsPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        ready: false,
        metricsModalVisible: false,
        metrics: null,
      };
    }

    openMetricsModal = (metrics) => {
      this.setState({metricsModalVisible: true, metrics: metrics});
    }

    closeMetricsModal = () => {
      this.setState({metricsModalVisible: false, metrics: null});
    }
  
    pauseButtonClicked = () => {
      console.log("Pause Button Clicked!");
    }

    createJobResultUI = (key, jobResult) => {
      console.log(jobResult);
      return (
        <Card
          key={key}
          title={`Job ${key}`}
          extra={
            <Typography.Link>
              <BarChartOutlined
                style={{"fontSize": 18}}
                onClick={() => this.openMetricsModal(jobResult)} />
            </Typography.Link>
          }
          style={{ width: '100%' }}
        >
          <Descriptions>
            <Descriptions.Item label="Bytes In">{jobResult.bytes_in.total}</Descriptions.Item>
            <Descriptions.Item label="Bytes Out">{jobResult.bytes_out.total}</Descriptions.Item>
            <Descriptions.Item label="Duration (s)">{(jobResult.duration / 1000000000.0).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Start Time">{moment(jobResult.earliest).format("MM/DD, h:mm:ss a")}</Descriptions.Item>
            <Descriptions.Item label="End Time">{moment(jobResult.latest).format("MM/DD, h:mm:ss a")}</Descriptions.Item>
            <Descriptions.Item label="Errors">None</Descriptions.Item>
            <Descriptions.Item label="Rate (reqs / s)">{parseFloat(jobResult.rate).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Requests">{jobResult.requests}</Descriptions.Item>
            <Descriptions.Item label="Status Codes">{Object.keys(jobResult.status_codes).join(', ')}</Descriptions.Item>
            <Descriptions.Item label="Percent Success">{jobResult.success}</Descriptions.Item>
            <Descriptions.Item label="Throughput (reqs / s)">{parseFloat(jobResult.throughput).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Latencies">see link</Descriptions.Item>
          </Descriptions>
        </Card>
      );
    }

    componentDidMount() {
      const { testInstances, history, match: { params: { id } } } = this.props;
      if (testInstances?.get(id)) {
        this.setState({ready: true});
      } else {
        // TODO: get TestID from referrer or something...
        TestInstance.all()
        .then(() => { this.setState({ready: true}); })
        .catch(() => { history.replace('/404'); })
      }
    }
  
    render() {
      const { match, location, testInstances } = this.props;
      const { id } = match.params;
      const { ready, metricsModalVisible } = this.state;

      if (!ready) {
        return null;
      }

      const instance = testInstances.get(id);
      console.log(instance.Metrics);

      const headerProps = {
        className: "site-page-header",
        title: "Test Instance Details",
        subTitle: `view the details of test instance ${id}`,
        extra: (
          <Button key="1" type="primary" onClick={this.pauseButtonClicked}>
            Pause Test Instance
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

      return (
        <Page
          CustomPageHeader={header}
          CustomPageContent={
            <Space direction="vertical" size='large' style={{ 'width': '100%' }}>
              <div>
                <Title type="secondary" level={4}>
                  Basic Information
                </Title>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="ID">{instance.ID}</Descriptions.Item>
                  <Descriptions.Item label="Test Template">
                    <Link to={{
                      pathname: `/test-template-details/${instance.TestID}`,
                      state: {from: location.pathname}
                    }}>
                      {instance.TestID}
                    </Link>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Badge status='success' text={instance.Status} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Created At">
                    {moment.unix(instance.CreatedAt).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    {instance.Type}
                  </Descriptions.Item>
                  <Descriptions.Item label="Prometheus Metric Link">
                    {/* TODO: refactor this link */}
                    <Typography.Link href="http://192.168.64.3:30421">
                      Grafana dashboard
                    </Typography.Link>
                  </Descriptions.Item>
                </Descriptions>
              </div>
              <div>
                <Title type='secondary' level={4}>
                  Results
                </Title>
                <Space direction="vertical" size='small' style={{ 'width': '100%' }}>
                  {
                    instance.Metrics
                    ? Object.keys(instance.Metrics).map(key => this.createJobResultUI(key, instance.Metrics[key]))
                    : null
                  }
                </Space>
              </div>
              <Modal
                title="Success and Latency Metrics"
                visible={metricsModalVisible}
                onOk={this.closeMetricsModal}
                onCancel={this.closeMetricsModal}
              >
                <p>Are you sure you want to start a new test instance?</p>
              </Modal>
            </Space>
          }
        />
      );
    }
  });

TestInstanceDetailsPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  //match: PropTypes.object.isRequired,
};

export default TestInstanceDetailsPage;
