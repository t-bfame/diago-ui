import React, { Component } from 'react';
import { Form, Input, PageHeader, Button, Breadcrumb, message } from 'antd';
import { Link } from 'react-router-dom';

import Page from '../../common/views/Page';
import Test from '../../model/test';

import DynamicJobField from './DynamicJobField';
import DynamicChaosField from './DynamicChaosField';

import '../styles/index.css';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

const headerProps = {
  className: "site-page-header",
  title: "Create Test Template",
  subTitle: "create a load test template",
};

class CreateTestTemplatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }

  onFinish = async(values) => {

    this.setState({loading: true});
    const { name, jobs, chaos } = values;

    const response = await Test.create({
      Name: name,
      Jobs: jobs.map(job => {
        return {
          Name: "placeholder",
          Group: job.group,
          Priority: 0,
          Frequency: parseInt(job.frequency),
          Duration: parseInt(job.duration),
          HTTPMethod: job.httpmethod,
          HTTPUrl: job.httpurl,
          HTTPBody: job.body,
        }
      }),
      Chaos: (chaos || []).map(c => {
        let selectors = {};
        c.selectors.forEach(obj => {
          if (obj && obj.selector) {
            let selector = obj.selector.split(":");
            selectors[selector[0]] = selector[1];
          }
        });
        return {
          Count: parseInt(c.count),
          Namespace: c.namespace,
          Selectors: selectors,
          Timeout: parseInt(c.timeout),
        }
      })
    });
    message.success("Successfully created test template!");
    this.setState({loading: false});

    if (this.props.location.state) {
      window.history.back();
    }
  }
  
  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  }

  render() {
    const { location } = this.props;
    const { loading } = this.state;
    const data = location.state ? location.state.data : null;

    const breadcrumb = (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        {data &&
          <Breadcrumb.Item>
            <Link to={`/test-template-details/${data.name}`}>
              {data.name}
            </Link>
          </Breadcrumb.Item>
        }
        <Breadcrumb.Item>
          {data ? "Edit" : "Create"} Test Template
        </Breadcrumb.Item>
      </Breadcrumb>
    );

    const headerProps = {
      className: "site-page-header",
      title: breadcrumb,
    };
    
    return (
      <Page
        currentPage="/"
        CustomPageHeader={<PageHeader {...headerProps} />}
        CustomPageContent={
          <Form
            {...layout}
            name="basic"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            initialValues={data || {jobs: [""]}}
          >
            <Form.Item
              className="form-fields"
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input the name!',
                },
              ]}
            >
              <Input disabled={data} placeholder='Name of test' />
            </Form.Item>
            
            <DynamicJobField />
            <DynamicChaosField data={data} />

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {data ? "Save Data" : "Submit" }
              </Button>
            </Form.Item>
          </Form>
        }
      />
    );
  }
}

CreateTestTemplatePage.propTypes = {
};

export default CreateTestTemplatePage;
