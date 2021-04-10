import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import TestInstance from './model/test-instance';
import { PageHeader, Space, Typography, Table } from 'antd';
import Page from './common/views/Page';
import Status from './common/views/Status';

const testInstanceCols = [
  {
    title: "Test Instance ID",
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: "Test Template ID",
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
              dataSource={activeIds.map(id => {
                const instance = testInstances.get(id)
                return {
                  ...instance,
                  key: instance.ID,
                  CreatedAt: moment.unix(instance.CreatedAt).format('YYYY-MM-DD'),
                  Status: <Status text={instance.Status} />
                };
              })}
              onRow={(record,) => ({onClick: () => { history.push(`test-instance-details/${record.ID}`); } })}
            />
          </div>
          <div>
            <Typography.Title type="secondary" level={4}>
              Finished
            </Typography.Title>
            <Table
              columns={testInstanceCols}
              dataSource={finishedIds.map(id => {
                const instance = testInstances.get(id);
                return {
                  ...instance,
                  key: instance.ID,
                  CreatedAt: moment.unix(instance.CreatedAt).format('YYYY-MM-DD'),
                  Status: <Status text={instance.Status} />
                };
              })}
              onRow={(record,) => ({onClick: () => { history.push(`test-instance-details/${record.ID}`); } })}
            />
          </div>
        </Space>
      }
      currentPage="/"
    />
  )
}

export default LandingPage;
