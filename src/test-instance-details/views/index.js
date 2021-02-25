import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PageHeader, Button, Space, Typography, Descriptions, Badge} from 'antd';

import Page from '../../common/views/Page';

const { Title, Link } = Typography;

const TestInstanceDetailPage = connect((state, { match: { params: {id} } }) => ({
    
}))(class TestInstanceDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

    }

    goToTestTemplateDeatilPage = () => {
      const { history, location } = this.props;
      //history.push(`test-template-details/${record.id}`, {from: location.pathname});
    }
  
    pauseButtonClicked = () => {
      console.log("Pause Button Clicked!");
    }
  
    render() {

      const { match, history, location } = this.props;
      const { id } = match.params;

      return (
        <Page
          CustomPageHeader={
            <PageHeader
              className="site-page-header"
              backIcon={false}
              title="Test Instance Details"
              subTitle="manage everything related to a test instance!"
              extra={
                <Button key="1" type="primary" onClick={this.pauseButtonClicked}>
                  Pause Test Instance
                </Button>
              }
            />
          }
          CustomPageContent={
              <Space direction="vertical" size='middle' style={{ 'width': '100%' }}>
                  <Descriptions title="Info" bordered column={1}>
                      <Descriptions.Item label="UID">Zhou Maomao</Descriptions.Item>
                      <Descriptions.Item label="Test Template">1810000000</Descriptions.Item>
                      <Descriptions.Item label="Status">
                          <Badge status="processing" text="Running" />
                      </Descriptions.Item>
                      <Descriptions.Item label="Prometheus Metric Link">
                          <Link href="https://ant.design">
                          Prometheus link
                          </Link>
                      </Descriptions.Item>
                  </Descriptions>
                  <div>
                      <Title level={4}>
                      Results:
                      </Title>
                  </div>
              </Space>
          }
        />
      );
    }
  });

TestInstanceDetailPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  //match: PropTypes.object.isRequired,
};

export default TestInstanceDetailPage;
