import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const layout = {
  labelCol: {
    span: 0,
  },
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};


const DynamicSelectorField = props => {
  const initialSels = props.data;

  return (
    <Form.List
      name={props.name}
    >
    {(fields, { add, remove }) => (
        <div>
        {fields.map(({ key, name, fieldKey }, index) => (
          <Form.Item
            {...layout}
            key={key}
            name={[index, "selector"]}
            fieldKey={[fieldKey, index]}
          >
            <Space align='baseline'>
              <Input defaultValue={initialSels ? `${initialSels[index].selector}` : null} placeholder="Key:Value" />
              {index === fields.length - 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
            </Space>
          </Form.Item>
        ))}
        <Form.Item {...tailLayout}>
          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
          Add Selector
          </Button>
        </Form.Item>
        </div>
    )}
    </Form.List>
  );
}

export default DynamicSelectorField;
