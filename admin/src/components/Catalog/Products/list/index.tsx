import React, { Fragment, useState } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: number;
  name: string;
  age: number;
  address: string;
  description: string;
}

const columns = (navigate) => [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: () => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`edit/1`)}>Edit</Button>
          <Button type="primary" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

const data: DataType[] = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "Not Expandable",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.",
  },
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows,
    );
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name,
  }),
};

const Products: React.FC = () => {
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox",
  );

  // ** Third party
  const navigate = useNavigate();

  return (
    <Fragment>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Products</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <div className="flex justify-end items-center">
                <Button
                  type="primary"
                  className="uppercase"
                  onClick={() => navigate("create")}
                >
                  New product
                </Button>
              </div>
            </Col>
            <Divider />
            <Col span={24}>
              <Card>
                <Table
                  bordered
                  columns={columns(navigate)}
                  expandable={{
                    expandedRowRender: (record) => (
                      <p style={{ margin: 0 }}>{record.description}</p>
                    ),
                    rowExpandable: (record) => record.name !== "Not Expandable",
                  }}
                  rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                  }}
                  dataSource={data}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Products;
