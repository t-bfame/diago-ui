import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, Breadcrumb, Space, Typography, Descriptions, Badge, Card, Statistic, Tooltip, Button} from 'antd';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';


import Page from '../../common/views/Page';
import Graph from '../../common/views/Graph';
import Status from '../../common/views/Status';
import Test from '../../model/test';
import TestInstance from '../../model/test-instance';

import '../styles/index.css';

const { Text } = Typography;

const TestInstanceDetailsPage = connect((state, { match: { params: {id} } }) => ({
  tests: state.model.tests,
  testInstances: state.model['test-instances'],
  dashMeta: state.dash.meta,
}))(class TestInstanceDetailsPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        ready: false,
      };
    }

    createStatTitle = (text, help) => {
      return (
        <div>
          {text}
          <Tooltip className="stat-title-tooltip" title={help}>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
      );
    }

    createChaosResultUI = (key, chaosResult) => {
      return (
        <Card
          key={key}
          title={<Text>{`Chaos ${key}`}</Text>}
          style={{ width: '100%' }}
        >
  
          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item><Statistic title="Status" formatter={(value) => <Status text={value} />} value={(chaosResult.Status)}/></Descriptions.Item>
          </Descriptions>
  
          {chaosResult.Error ? <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item><Statistic title="Error Message" value={chaosResult.Error}/></Descriptions.Item>
          </Descriptions>  : null}

          {chaosResult.DeletedPods ? <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item>
              <Statistic title="Deleted Pods" value={chaosResult.DeletedPods} formatter={() => {
                return chaosResult.DeletedPods.map((podName) => <Status text={podName} />)
              }} />
            </Descriptions.Item>
          </Descriptions>  : null}
  
        </Card>
    )
    }

    createJobResultUI = (key, jobResult) => {
      const latencies = jobResult.latencies;
      const convert = l => {
        let dur = moment.duration(l / 1000000.0);
        return (dur.asSeconds() > 1 ? dur.asSeconds() : dur.asMilliseconds()).toFixed(2);
      };

      const convertUnit = l => {
        let dur = moment.duration(l / 1000000.0);
        return (dur.asSeconds() > 1 ? "s" : "ms");
      };

      let errCodeStringMap = {};
      if(jobResult.errors) {
        jobResult.errors.forEach((err) => {
          let spl = err.split(" ")
          errCodeStringMap[parseInt(spl[0])] = err; 
        })
      }

      return (
        <Card
          key={key}
          title={<Text>{`Job ${key}`}</Text>}
          style={{ width: '100%' }}
        >

          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Percent Success", "The percentage of requests whose responses didn't error and had status codes in (200, 400)")}
                value={(jobResult.success*100).toFixed(2)} suffix="%"
              />
            </Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Duration", "The total duration of the load test")}
                value={(jobResult.duration / 1000000000.0).toFixed(2)} suffix="s"/>
            </Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Time Range", "Start time to end time")}
                value={moment(jobResult.earliest).format("h:mm:ss a") + " - " + moment(jobResult.latest).format("h:mm:ss a")}/>
            </Descriptions.Item>
          </Descriptions>
          
          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Requests", "The total number of requests executed")}
                value={jobResult.requests} suffix=""/>
            </Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Rate", "Total requests / duration")}
                value={parseFloat(jobResult.rate).toFixed(2)} suffix="reqs / s"/></Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Throughput", "Total successful requests / duration")}
                value={parseFloat(jobResult.throughput).toFixed(2)} suffix="reqs / s"/></Descriptions.Item>
          </Descriptions>
          
          <Descriptions className="value-title-style" column={1}>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Status codes", "A list of status codes that appeared in responses and their frequency")}
                value={" "}
                formatter={
                (value) => Object.keys(jobResult.status_codes).map(
                  (code) => (
                    <Tooltip key={code} title={errCodeStringMap[code]}>
                      <Badge 
                        count={code + ": " + jobResult.status_codes[code]} 
                        style={{ backgroundColor: code >= 200 && code <= 299 ? '#87d068' : "#f50" }} 
                        overflowCount={100000} />
                    </Tooltip>
                ))
              }/>
            </Descriptions.Item>
          </Descriptions>

          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency total", "The sum of latencies across all requests")}
                value={convert(latencies.total)} suffix={convertUnit(latencies.total)}/>
            </Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency min", "The minimum latency of all requests")}
                value={convert(latencies.min)} suffix={convertUnit(latencies.min)}/>
            </Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency max", "The maximum latency of all requests")}
                value={convert(latencies.max)} suffix={convertUnit(latencies.max)}/></Descriptions.Item>
          </Descriptions>
          
          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency 50th", "The 50th percentile of the latencies of all requests")}
                value={convert(latencies['50th'])} suffix={convertUnit(latencies['50th'])}/></Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency 90th", "The 90th percentile of the latencies of all requests")}
                value={convert(latencies['90th'])} suffix={convertUnit(latencies['90th'])}/></Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency 95th", "The 95th percentile of the latencies of all requests")}
                value={convert(latencies['95th'])} suffix={convertUnit(latencies['95th'])}/></Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Latency 99th", "The 99th percentile of the latencies of all requests")}
                value={convert(latencies['99th'])} suffix={convertUnit(latencies['99th'])}/></Descriptions.Item>
          </Descriptions>

          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Bytes In", "The total number of bytes received in with the response bodies.")}
                value={jobResult.bytes_in.total / 1000} suffix="kB"/></Descriptions.Item>
            <Descriptions.Item>
              <Statistic
                title={this.createStatTitle("Bytes Out", "The total number of bytes sent out with the request bodies.")}
                value={jobResult.bytes_out.total / 1000} suffix="kB"/></Descriptions.Item>
          </Descriptions>

        </Card>
      );
    }

    createGraphResultUI = (instance) => {
      const { dashMeta } = this.props;

      let start = moment(instance.CreatedAt * 1000);
      let end = moment();

      if (instance.Metrics) {
        start = null;
        end = null;

        Object.keys(instance.Metrics).forEach(key => {
          let curStart = moment(instance.Metrics[key].earliest);
          let curEnd = moment(instance.Metrics[key].latest);
  
          start = start === null ? curStart : moment.max(curStart, start);
          end = end === null ? curEnd : moment.max(curEnd, end);
        });

        end = end.add(1, 'minutes');
      }

      start = start.subtract(1, 'minutes');

      let from = start.unix() * 1000;
      let to = end.unix() * 1000;

      return (
        <Graph meta={dashMeta} from={from} to={to} instanceId={instance.ID} testID={instance.TestID} />
      )
    }

    componentDidMount() {
      const { tests, testInstances, match: { params: { id } } } = this.props;
      const instance = testInstances?.get(id);
      if (instance) {
        const test = tests?.get(instance.TestID);
        if (test) {
          this.setState({ready: true});
        } else {
          Test.get(instance.TestID).then(() => { this.setState({ready: true}); });
        }
      } else {
        // TODO: get TestID from referrer or something...
        TestInstance.all().then(async ({ docs }) => {
          await Test.get(docs.find(d => d.ID === id).TestID);
          this.setState({ready: true});
        });
      }
    }
  
    render() {
      const { match, location, tests, testInstances } = this.props;
      const { id } = match.params;
      const { ready } = this.state;

      if (!ready) {
        return null;
      }
      const instance = testInstances.get(id);
      const test = tests.get(instance.TestID);

      const breadcrumb = (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/test-template-details/${instance.TestID}`}>
              {instance.TestID}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {id}
          </Breadcrumb.Item>
        </Breadcrumb>
      );

      const headerProps = {
        className: "site-page-header",
        title: breadcrumb,
        subTitle: `view test instance details!`,
        extra: (
          instance.Status !== "submitted" ? null :
          <Button
            key="1"
            onClick={() => { 
              test.stop().then(() => { TestInstance.forTestId(instance.TestID); });
            }}
            type="primary"
            danger
          >
            Stop Test Instance
          </Button>
        ) 
      };
      console.log(instance);
      return (
        <Page
          currentPage="/"
          CustomPageHeader={<PageHeader {...headerProps} />}
          CustomPageContent={
            <Space direction="vertical" size='large' style={{ 'width': '100%' }}>
              <div>
                <div className="value-metadata-style">
                  <Descriptions column={2}>
                    <Descriptions.Item>
                      <Statistic title="Instance ID" value={instance.ID} suffix=""/>
                    </Descriptions.Item>
                    <Descriptions.Item>
                      <Statistic title="Test ID" value={instance.TestID} formatter={(value) => {
                        return <Link to={{
                          pathname: `/test-template-details/${value}`,
                          state: {from: location.pathname}
                        }}>
                          {value}
                        </Link>
                      }}/>
                    </Descriptions.Item>
                    <Descriptions.Item>
                      <Statistic title="Status" value={instance.Status} formatter={(value) => {
                        return <Status text={value} />
                      }}/>
                    </Descriptions.Item>
                    <Descriptions.Item>
                      <Statistic title="Type" value={instance.Type} formatter={(value) => {
                        return <Status text={value} />
                      }}/>
                    </Descriptions.Item>
                    {instance.Error &&
                      <Descriptions.Item>
                        <Statistic title="Failure Reason" value={instance.Error} />
                      </Descriptions.Item>
                    }
                  </Descriptions>
                </div>
              </div>
              {this.createGraphResultUI(instance)}
              <div>
                <Space direction="vertical" size='small' style={{ 'width': '100%' }}>
                  {
                    instance.Metrics
                    ? Object.keys(instance.Metrics).map(key => this.createJobResultUI(key, instance.Metrics[key]))
                    : null
                  }
                </Space>
              </div>
              <div>
                <Space direction="vertical" size='small' style={{ 'width': '100%' }}>
                  {
                    instance.ChaosResult
                    ? Object.keys(instance.ChaosResult).map(key => this.createChaosResultUI(key, instance.ChaosResult[key]))
                    : null
                  }
                </Space>
              </div>
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
