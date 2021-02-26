import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PageHeader, Button, Space, Typography, Descriptions, Badge} from 'antd';

import Page from '../../common/views/Page';

const { Title, Link } = Typography;

const TestInstanceDetailsPage = connect((state, { match: { params: {id} } }) => ({
  testInstances: state.model['test-instances'],
}))(class TestInstanceDetailsPage extends Component {
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
      const { match, history, location, testInstances } = this.props;
      const { id } = match.params;

      console.log(testInstances);

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

TestInstanceDetailsPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  //match: PropTypes.object.isRequired,
};

export default TestInstanceDetailsPage;
