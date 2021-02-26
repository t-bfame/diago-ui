import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Typography }  from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import '../styles/index.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

class Page extends Component {
  constructor(props) {
    super(props);
    this.state= {
      collapsed: false,
    };
  }

  onCollapse = collapsed => {
    this.setState({collapsed});
  }

  handleNavigation = e => {
    const { history } = this.props;
    history.push(e.key);
  }

  render() {
    const { CustomPageHeader, CustomPageContent, currentPage } = this.props;
    const { collapsed } = this.state;
    const siteTitleText = collapsed ? 'D' : 'Diago';
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo">
            <Title
              level={3}
              style={{
                'color': '#fff',
                'textAlign': 'center',
              }}
            >
              {siteTitleText}
            </Title>
          </div>
          <Menu theme="dark" defaultSelectedKeys={[currentPage]} mode="inline" onClick={this.handleNavigation}>
            <Menu.Item key="/" icon={<PieChartOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key="/tests" icon={<DesktopOutlined />}>
              Test Templates
            </Menu.Item>
            <Menu.Item key="/resources" icon={<TeamOutlined />} title="Team">
              Resources
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {CustomPageHeader}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: '24px 0',
              padding: 24,
              minHeight: 280,
            }}
          >
            {CustomPageContent}
          </Content>
          <Footer style={{ textAlign: 'center' }}>©2021 Created by t-bfame</Footer>
        </Layout>
      </Layout>
    );
  }
}

Page.propTypes = {
  CustomPageHeader: PropTypes.element.isRequired,
  CustomPageContent: PropTypes.element.isRequired,
  history: PropTypes.object.isRequired,
  currentPage: PropTypes.string,
};

export default withRouter(Page);
