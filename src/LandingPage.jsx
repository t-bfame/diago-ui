import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import TestInstance from './model/test-instance';
import { PageHeader, Space, Typography, Table } from 'antd';
import Page from './common/views/Page';

const testInstanceCols = [
  {
    title: "ID",
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: "TestID",
    dataIndex: 'TestID',
    key: 'TestID',
  },
  {
    title: "Type",
    dataIndex: 'Type',
    key: 'Type',
  },
  {
    title: "Status",
    dataIndex: 'Status',
    key: 'Status',
  },
  {
    title: "Created At",
    dataIndex: 'CreatedAt',
    key: "CreatedAt",
  },
];

const LandingPage = ({ history }) => {
  const [activeIds, setActiveIds] = useState([]);
  const [finishedIds, setFinishedIds] = useState([]);
  useEffect(() => {
    TestInstance.all().then(r => {
      const ordered = r.docs.sort(({ CreatedAt: c1 }, { CreatedAt: c2 }) => c2 - c1);
      const active = [];
      const finished = [];
      for (var i = 0; i < ordered.length; i++) {
        if (ordered[i].isTerminal()) {
          finished.push(ordered[i].ID);
        } else {
          active.push(ordered[i].ID);
        }
        if (active.length + finished.length === 10) {
          break;
        }
      }
      setActiveIds(active);
      setFinishedIds(finished);
    });
  }, []);
  const testInstances = useSelector(state => state.model['test-instances']);
  return (
    <Page
      CustomPageHeader={
        <PageHeader
          className="site-page-header"
          title="Recent Test Instances"
        />
      }
      CustomPageContent={
        <Space direction="vertical" size='large' style={{ 'width': '100%' }}>
          <div>
            <Typography.Title type="secondary" level={4}>
              Active
            </Typography.Title>
            <Table
              columns={testInstanceCols}
              dataSource={activeIds.map(id => testInstances.get(id))}
              // TODO: links to test instance details
            />
          </div>
          <div>
            <Typography.Title type="secondary" level={4}>
              Finished
            </Typography.Title>
            <Table
              columns={testInstanceCols}
              dataSource={finishedIds.map(id => testInstances.get(id))}
              // TODO: links to test instance details
            />
          </div>
        </Space>
      }
    />
  )
}

export default LandingPage;
