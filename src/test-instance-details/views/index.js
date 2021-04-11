import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { PageHeader, Space, Typography, Descriptions, Badge, Card, Statistic, Tooltip } from 'antd';
import moment from 'moment';

import Page from '../../common/views/Page';
import Graph from '../../common/views/Graph';
import Status from '../../common/views/Status';
import TestInstance from '../../model/test-instance';

import '../styles/index.css';

const { Text } = Typography;

const TestInstanceDetailsPage = connect((state, { match: { params: {id} } }) => ({
  testInstances: state.model['test-instances'],
}))(class TestInstanceDetailsPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        ready: false,
      };
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
            <Descriptions.Item><Statistic title="Percent Success" value={(jobResult.success*100).toFixed(2)} suffix="%"/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Duration" value={(jobResult.duration / 1000000000.0).toFixed(2)} suffix="s"/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Time Range" value={moment(jobResult.earliest).format("h:mm:ss a") + " - " + moment(jobResult.latest).format("h:mm:ss a")}/></Descriptions.Item>
          </Descriptions>
          
          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item><Statistic title="Requests" value={jobResult.requests} suffix=""/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Rate" value={parseFloat(jobResult.rate).toFixed(2)} suffix="reqs / s"/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Throughput" value={parseFloat(jobResult.throughput).toFixed(2)} suffix="reqs / s"/></Descriptions.Item>
          </Descriptions>
          
          <Descriptions className="value-title-style" column={1}>
            <Descriptions.Item>
              <Statistic title="Status codes" value={" "} formatter={
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
            <Descriptions.Item><Statistic title="Latency total" value={convert(latencies.total)} suffix={convertUnit(latencies.total)}/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Latency min" value={convert(latencies.min)} suffix={convertUnit(latencies.min)}/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Latency max" value={convert(latencies.max)} suffix={convertUnit(latencies.max)}/></Descriptions.Item>
          </Descriptions>
          
          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item><Statistic title="Latency 50th" value={convert(latencies['50th'])} suffix={convertUnit(latencies['50th'])}/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Latency 90th" value={convert(latencies['90th'])} suffix={convertUnit(latencies['90th'])}/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Latency 95th" value={convert(latencies['95th'])} suffix={convertUnit(latencies['95th'])}/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Latency 99th" value={convert(latencies['99th'])} suffix={convertUnit(latencies['99th'])}/></Descriptions.Item>
          </Descriptions>

          <Descriptions className="value-title-style" column={4}>
            <Descriptions.Item><Statistic title="Bytes In" value={jobResult.bytes_in.total / 1000} suffix="kB"/></Descriptions.Item>
            <Descriptions.Item><Statistic title="Bytes Out" value={jobResult.bytes_out.total / 1000} suffix="kB"/></Descriptions.Item>
          </Descriptions>

        </Card>
      );
    }

    createGraphResultUI = (instance) => {

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
        <Graph from={from} to={to} instanceId={instance.ID} testID={instance.TestID} />
      )
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
      const { ready } = this.state;

      if (!ready) {
        return null;
      }

      const instance = testInstances.get(id);

      const headerProps = {
        className: "site-page-header",
        title: "Test Instance Details",
        subTitle: `view the details of test instance ${id}`,
      };

      const header = location.state
      ? (
        <PageHeader
          {...headerProps}
          onBack={() => window.history.back()}
        />
      ) : <PageHeader {...headerProps} backIcon={false} />

      // TODO: Add tooltip with information about metric fields
      return (
        <Page
          CustomPageHeader={header}
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
