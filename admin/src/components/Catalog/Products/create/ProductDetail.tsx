import React, { Fragment, useState } from "react";
import { Tabs, Form, Input, Col, Row, Upload } from "antd";
import type { TabsProps } from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {  } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `Product details`,
    children: <ProductDetailTab />,
  },
  {
    key: "2",
    label: `Product variants`,
    children: `Content of Tab Pane 2`,
  },
];

function ProductDetail() {
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
}

function ProductDetailTab() {
    const [value, setValue] = useState('Now test equipped with seventh-generation Intel Core processors, Laptop is snappier than ever. From daily tasks like launching apps and opening files to more advanced computing, you can power through your day thanks to faster SSDs and Turbo Boost processing up to 3.6GHz.');
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ]);
    
      const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
      };
    
      const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as RcFile);
            reader.onload = () => resolve(reader.result as string);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };
    
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Row gutter={[16, 8]}>
          <Col span={16}>
        <Form
      name="basic"
      layout="horizontal"
      labelCol={{ flex: '200px' }}
      labelAlign="left"
    //   style={{ maxWidth: 700 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Product Name"
        name="product_name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
      >
       <ReactQuill theme="snow" value={value} onChange={setValue} />
      </Form.Item>

    </Form>
    </Col>
    <Col span={8}>
    <ImgCrop rotationSlider>
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
      >
        {fileList.length < 5 && '+ Add asset'}
      </Upload>
    </ImgCrop>
    </Col>
    </Row>
  );
}

export default ProductDetail;
