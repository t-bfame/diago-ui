import React from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Divider, Button, Input } from "antd";

import DynamicSelectorField from './DynamicSelectorField';

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

const DynamicChaosField = props => {
  const data = props.data && props.data.chaos;
  return (
    <Form.List name="chaos">
      {(fields, { add, remove }) => (
        <div className="form-fields">
          {fields.map((field, index) => (
            <div key={field.key}>
              <Divider>Chaos Config {index + 1}</Divider>
              <Form.Item
                name={[index, "namespace"]}
                label="Namespace"
                rules={[
                  {
                    required: true,
                    message: 'Please input a namespace!',
                  },
                ]}
              >
                <Input placeholder="Namespace" />
              </Form.Item>
              <DynamicSelectorField
                name={[index, "selectors"]}
                data={data && index < data.length && data[index].selectors ? data[index].selectors : null}
              />
              <Form.Item
                label="Timeout (s)"
                name={[index, "timeout"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input a timeout!',
                  },
                ]}
              >
                <Input placeholder="example: 2" />
              </Form.Item>
              <Form.Item
                label="Count"
                name={[index, "count"]}
                rules={[
                  {
                    required: true,
                    message: 'Please input a count!',
                  },
                ]}
              >
                <Input placeholder='example: 10' />
              </Form.Item>
              {index !== 0 && fields.length > 1 ? (
                <Form.Item {...tailLayout}>
                  <Button
                    type="danger"
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                    icon={<MinusCircleOutlined />}
                  >
                    Remove Chaos Config
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
              <PlusOutlined /> Add A Chaos Config
            </Button>
          </Form.Item>
        </div>
      )}
    </Form.List>
  );
}

export default DynamicChaosField;
