import React, { Component } from 'react';
import { Form, Input, PageHeader, Button } from 'antd';

import Page from '../../common/views/Page';
import Test from '../../model/test';

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
    console.log('Success:', values);
    this.setState({loading: true});
    const { name, jobname, group, frequency, duration, httpmethod, httpurl } = values;
    const response = await Test.create({
      Name: name,
      Jobs: [
        {
          Name: jobname,
          Group: group,
          Priority: 0,
          Frequency: parseInt(frequency),
          Duration: parseInt(duration),
          HTTPMethod: httpmethod,
          HTTPUrl: httpurl,
        },
      ],
    });
    console.log(response);
    this.setState({loading: false});
    // TODO: show success banner
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
          <Form
            {...layout}
            name="basic"
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input the name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Job Name"
              name="jobname"
              rules={[
                {
                  required: true,
                  message: 'Please input the job name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Job Group"
              name="group"
              rules={[
                {
                  required: true,
                  message: 'Please input the group!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Job Frequency"
              name="frequency"
              rules={[
                {
                  required: true,
                  message: 'Please input the frequency!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Job Duration"
              name="duration"
              rules={[
                {
                  required: true,
                  message: 'Please input the duration!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="HTTP Method"
              name="httpmethod"
              rules={[
                {
                  required: true,
                  message: 'Please input the HTTP method!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="HTTP Url"
              name="httpurl"
              rules={[
                {
                  required: true,
                  message: 'Please input the HTTP Url!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
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
