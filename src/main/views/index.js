import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PageHeader, Button } from 'antd';

import Page from '../../common/views/Page';
import MainPageContent from './MainPageContent';
import { getTest } from '../actions';

class MainPage extends Component {
  goToCreateTestTemplatePage = () => {
    const { history, location } = this.props;
    history.push('create-test-template', {from: location.pathname});
  }

  render() {
    const { getTest, testTemplate, history, location } = this.props;
    return (
      <Page
        CustomPageHeader={
          <PageHeader
            className="site-page-header"
            backIcon={false}
            title="Test Templates"
            subTitle="create, view, and manage load tests!"
            extra={
              <Button key="1" type="primary" onClick={this.goToCreateTestTemplatePage}>
                Create Template
              </Button>
            }
          />
        }
        CustomPageContent={
          <MainPageContent
            history={history}
            location={location}
            getTest={getTest} 
            testTemplate={testTemplate}
          />
        }
      />
    );
  }
}

MainPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getTest: PropTypes.func.isRequired,
  testTemplate: PropTypes.object,
};

const mapStateToProps = ({ mainPageReducer }) => ({
  testTemplate: mainPageReducer.testTemplate,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTest: getTest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
