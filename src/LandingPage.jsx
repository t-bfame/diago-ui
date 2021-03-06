import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Test from './model/test';
import TestInstance from './model/test-instance';
import { PageHeader, Space, Typography, Table, AutoComplete, Breadcrumb, Button, Popover } from 'antd';
import Page from './common/views/Page';
import Status from './common/views/Status';
import Date from './common/views/Date';

import {
  SearchOutlined
} from '@ant-design/icons';

import './index.scss';

const testInstanceCols = [
  {
    title: "Test Instance ID",
    dataIndex: 'ID',
    key: 'ID',
  },
  {
    title: "Test Template",
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
    title: "Started At",
    dataIndex: 'CreatedAt',
    key: "CreatedAt",
  },
];

const LandingPage = ({ history, location }) => {
  const [activeIds, setActiveIds] = useState([]);
  const [finishedIds, setFinishedIds] = useState([]);
  const [options, setOptions] = useState([]);

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

  const onSearch = (testId) => {
    Test.forPrefix(testId).then(r => {
      setOptions(r.docs.map(doc => doc.ID));
    }).catch(() => {
      setOptions([]);
    });
  };

  const onSelect = (testId) => {
    history.push(`test-template-details/${testId}`, {from: location.pathname})
  }

  const goToCreateTestTemplatePage = () => {
    history.push('create-test-template', {from: location.pathname});
  }

  const handleRowClick = (record) => {
    if (record.debugStatus !== "failed") {
      // history.push(`test-instance-details/${record.ID}`);
    }
  }

  const testInstances = useSelector(state => state.model['test-instances']);

  const breadcrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        Home
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  const headerProps = {
    className: "site-page-header",
    title: breadcrumb,
    subTitle: `view recent test instances!`,
    extra: <Button key="1" type="primary" onClick={goToCreateTestTemplatePage}>Create Test Template</Button>, 
  };


  return (
    <Page
      CustomPageHeader={<PageHeader {...headerProps} />}
      CustomPageContent={
        <Space direction="vertical" size='large' style={{ "width": '100%' }}>
          <Space style={{"width": '100%'}} className="search-bar">
            <SearchOutlined
              style={{"fontSize": 20, "color": "#1890ff"}}
            />
            <AutoComplete
              onSearch={onSearch}
              onSelect={onSelect}
              style={{width: '100%'}}
              placeholder="Look for a test template ...">
              {
                options.map((id) => (
                  <AutoComplete.Option key={id} value={id}>
                    {id}
                  </AutoComplete.Option>
                ))
              }
            </AutoComplete>
          </Space>
          <div>
            <Typography.Title level={5}>
              Active
            </Typography.Title>
            <Table
              columns={testInstanceCols}
              pagination={{"defaultPageSize": 5, "pageSize": 5, "size": "small"}}
              dataSource={activeIds.map(id => {
                const instance = testInstances.get(id)
                return {
                  ...instance,
                  key: instance.ID,
                  ID: <Typography.Link onClick={() => { history.push(`test-instance-details/${instance.ID}`, {from: location.pathname}) }}>{instance.ID}</Typography.Link>,
                  TestID: <Typography.Link onClick={() => { history.push(`test-template-details/${instance.TestID}`, {from: location.pathname}) }}>{instance.TestID}</Typography.Link>,
                  Type: <Status text={instance.Type} />,
                  CreatedAt: <Date date={instance.CreatedAt} />,
                  Status: instance.Error ? <Popover placement="left" content={"Error: " + instance.Error}><div><Status text={instance.Status} /></div></Popover> : <Status text={instance.Status} />,
                  debugStatus: instance.Status,
                };
              })}
              onRow={(record,) => ({onClick: () => { handleRowClick(record); }})}
            />
          </div>
          <div>
            <Typography.Title level={5}>
              Finished
            </Typography.Title>
            <Table
              columns={testInstanceCols}
              pagination={{"defaultPageSize": 5, "pageSize": 5, "size": "small"}}
              dataSource={finishedIds.map(id => {
                const instance = testInstances.get(id);
                return {
                  ...instance,
                  key: instance.ID,
                  ID: <Typography.Link onClick={() => { history.push(`test-instance-details/${instance.ID}`, {from: location.pathname}) }}>{instance.ID}</Typography.Link>,
                  TestID: <Typography.Link onClick={() => { history.push(`test-template-details/${instance.TestID}`, {from: location.pathname}) }}>{instance.TestID}</Typography.Link>,
                  Type: <Status text={instance.Type} />,
                  CreatedAt: <Date date={instance.CreatedAt} />,
                  Status: instance.Error ? <Popover placement="left" content={"Error: " + instance.Error}><div><Status text={instance.Status} /></div></Popover> : <Status text={instance.Status} />,
                  debugStatus: instance.Status,
                };
              })}
              onRow={(record,) => ({onClick: () => { handleRowClick(record); }})}
            />
          </div>
        </Space>
      }
      currentPage="/"
    />
  )
}

export default LandingPage;
