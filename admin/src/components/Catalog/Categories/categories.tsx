import * as React from 'react';
import { Col, Row, Table, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    key: string;
    stt: number;
    categoryName: string;
    categoryCode: string;
    status: number;
    // age: number;
    // address: string;
    // tags: string[];
}

const columns: ColumnsType<DataType> = [
    {
        title: 'STT',
        align: 'center',
        dataIndex: 'stt',
        key: 'stt',
        render: (stt) => <span>{stt}</span>,
    },
    {
        title: 'Category Name',
        align: 'center',
        dataIndex: 'categoryName',
        key: 'categoryName',
        render: (categoryName) => <span>{categoryName}</span>,
    },
    {
        title: 'Category Code',
        align: 'center',
        dataIndex: 'categoryCode',
        key: 'categoryCode',
        render: (categoryCode) => <span>{categoryCode}</span>,
    },
    {
        title: 'Status',
        align: 'center',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <span>{status}</span>,
    },
    {
        title: 'Action',
        align: 'center',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button type="info">Detail</Button>
                <Button type="success">Edit</Button>
                <Button type="primary" danger>Delete</Button>
            </Space>
        ),
    },
]

const Categories = () => {
    const data: DataType[] = [
        {
            key: '1',
            stt: 1,
            categoryName: "puma",
            categoryCode: "pu",
            status: 1

        },
    ]
    return (
        <React.Fragment>
            <Row justify="space-between" >
                <Col span={12}>
                    <form>
                        <input type='text' />
                    </form>
                </Col>
                <Col span={3}>
                    <Button type="primary">Create New Category</Button>
                </Col>
            </Row>
            <Row style={{ marginTop: '2rem' }}>
                <Col span={24}>
                    <Table columns={columns}  />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Categories;