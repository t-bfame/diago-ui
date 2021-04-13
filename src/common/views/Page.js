import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Space, Typography }  from 'antd';
import {
  PieChartOutlined,
  GithubOutlined,
  FileSearchOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
} from '@ant-design/icons';

import '../styles/index.css';
import Logo from './logo.svg';

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
    if (e.key === "/") {
      history.push(e.key);
    }
  }

  render() {
    const { CustomPageHeader, CustomPageContent, currentPage } = this.props;
    const { collapsed } = this.state;
    const siteTitleLogo = <img className='logo' src={Logo} alt="Diago" />;
    
    return (
      <Layout>
        <Sider style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        left: 0,
        top: 0,
      }} collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo-container">
            <Title
              level={3}
              style={{
                'color': '#fff',
                'textAlign': 'center',
              }}
            >
              <Space direction="vertical">
              {siteTitleLogo}
              Diago
              </Space>
            </Title>
          </div>
          <Menu theme="dark" defaultSelectedKeys={[currentPage]} mode="inline" onClick={this.handleNavigation}>
            <Menu.Item key="/" icon={<PieChartOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key="/github" icon={<GithubOutlined />}>
              <a href="https://github.com/t-bfame" target="_blank">
                Github
              </a>
            </Menu.Item>
            <Menu.Item key="/wiki" icon={<FileSearchOutlined />}>
              <a href="https://github.com/t-bfame/diago/wiki" target="_blank">
                Wiki
              </a>
            </Menu.Item>
            <Menu.Item key="/issues" icon={<ExclamationCircleOutlined />}>
              <a href="https://github.com/t-bfame/diago/issues" target="_blank">
                Issues
              </a>
            </Menu.Item>
            <Menu.Item key="/releases" icon={<TagOutlined />}>
              <a href="https://github.com/t-bfame/diago/releases" target="_blank">
                Releases
              </a>
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
