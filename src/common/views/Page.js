import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Typography }  from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

import '../styles/index.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

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

  render() {
    const { CustomPageHeader, CustomPageContent } = this.props;
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
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              Option 1
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              Option 2
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
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
};

export default Page;
