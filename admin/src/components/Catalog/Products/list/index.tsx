import React, { Fragment } from 'react';
import { Breadcrumb, Button, Card, Col, Divider, Row, Space, Table } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const Products: React.FC = () => {
    // ** Third party
    const navigate = useNavigate()

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Products</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <div className='flex justify-end items-center'>
                                <Button type="primary" className='uppercase' onClick={() => navigate('create')}>New product</Button>
                            </div>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table bordered columns={columns} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Products;