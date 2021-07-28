import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Select, Input } from "antd";

const { TextArea } = Input;

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

const DynamicJobField = props => {
  return (
    <Form.List name="jobs">
      {(fields, { add, remove }) => (
        <div className="form-fields">
          {fields.map((field, index) => (
            <div key={field.key}>
              <Divider>Job {index + 1}</Divider>
              <Form.Item
                label="Worker Group"
                name={[index, "group"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input the worker group!',
                  },
                ]}
              >
                <Input placeholder='worker group' />
              </Form.Item>
              <Form.Item
                label="Frequency (requests / s)"
                name={[index, "frequency"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input the frequency!',
                  },
                ]}
              >
                <Input placeholder="example: 30" />
              </Form.Item>
              <Form.Item
                label="Duration (s)"
                name={[index, "duration"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input the duration in seconds!',
                  },
                ]}
              >
                <Input placeholder='example: 10' />
              </Form.Item>
              <Form.Item
                label="HTTP Method"
                name={[index, "httpmethod"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input the HTTP method!',
                  },
                ]}
              >
                <Select>
                  <Select.Option value="GET">GET</Select.Option>
                  <Select.Option value="PUT">PUT</Select.Option>
                  <Select.Option value="POST">POST</Select.Option>
                  <Select.Option value="DELETE">DELETE</Select.Option>
                  <Select.Option value="OPTIONS">OPTIONS</Select.Option>
                  <Select.Option value="PATCH">PATCH</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="JSON Body"
                name={[index, "body"]}
              >
                <TextArea rows={3} placeholder='{&#10;.&emsp;"foo": "bar"&#10;}' />
              </Form.Item>
              <Form.Item
                label="HTTP Url"
                name={[index, "httpurl"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input the HTTP Url!',
                  },
                ]}
              >
                <Input placeholder='example: http://google.com' />
              </Form.Item>
              <Form.Item
                label="Response Persist Data Sampling Period"
                name={[index, "persistResponseSamplingPeriod"]}
              >
                <Input placeholder="example: 10" />
              </Form.Item>
              {index !== 0 && fields.length > 1 ? (
                <Form.Item {...tailLayout}>
                  <Button
                    type="danger"
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove Job
                  </Button>
                </Form.Item>
              ) : null}
            </div>
          ))}
          <Divider />
          <Form.Item {...tailLayout}>
            <Button
              type="dashed"
              onClick={() => add()}
            >
              <PlusOutlined /> Add Another Job
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
}

export default DynamicJobField;
