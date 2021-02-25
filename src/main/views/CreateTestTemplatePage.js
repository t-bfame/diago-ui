import React, { Component } from 'react';
import { Form, Input, PageHeader, Button } from 'antd';

import Page from '../../common/views/Page';
import Test from '../../model/test';

import DynamicJobField from './DynamicJobField';

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
    const { name, jobs } = values;

    const response = await Test.create({
      Name: name,
      Jobs: jobs.map(job => {
        return {
          Name: job.name,
          Group: job.group,
          Priority: 0,
          Frequency: parseInt(job.frequency),
          Duration: parseInt(job.duration),
          HTTPMethod: job.httpmethod,
          HTTPUrl: job.httpurl,
        }
      })
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
            initialValues={{jobs: [""]}}
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
              <Input placeholder='Name of test' />
            </Form.Item>

            <DynamicJobField />

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
