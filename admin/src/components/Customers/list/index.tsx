import { Breadcrumb, Button, Card, Col, Divider, Modal, Row, Space, Switch, Table, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import { Flex } from '@chakra-ui/react';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import type { ColumnsType } from 'antd/es/table';
import { deleteCustomer, getListCustomer } from 'src/features/customer/action';

interface DataType {
    key: number
    id: number
    email: string;
    first_name: string
    last_name: string
    phone: string
    active: number
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    customerDelete: { id: number, email: string } | undefined,
    setCustomerDelete: ({ id, email }: { id: number, email: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'First name',
            dataIndex: 'first_name',
            key: 'first name',
        },
        {
            title: 'Last name',
            dataIndex: 'last_name',
            key: 'last name',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (active: number) => {
                return (
                    <Switch disabled={true} checked={active === 1} />
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setCustomerDelete({
                                ...customerDelete,
                                id: record.id,
                                email: record.email
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const Customers = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [customerDelete, setCustomerDelete] = useState<{ id: number, email: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const customer = useAppSelector((state) => state.customer);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListCustomer({
            pagination: {
                skip,
                take
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [skip, take, refresh])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!customer.list.loading && customer.list.result) {
            return customer.list.result.customers.map((customer, index: number) => {
                return {
                    key: index,
                    id: customer.id,
                    email: customer.email,
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone: customer.phone,
                    active: customer.active
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteCustomer({
            axiosClientJwt,
            dispatch,
            navigate,
            id: customerDelete?.id!,
            refresh,
            setIsModalOpen,
            setRefresh,
            message
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Customers</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}>
                                <Button
                                    style={{ textTransform: "uppercase" }}
                                    type="primary"
                                    onClick={() => navigate('create')}
                                    icon={<PlusCircleOutlined />}
                                >
                                    Create new Customer
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table bordered columns={columns(setIsModalOpen, customerDelete, setCustomerDelete, navigate)} dataSource={dataRender()} loading={customer.list.loading} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Delete role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={customer.delete.loading}>
                <p>Do you want to delete this customer (<span style={{ fontWeight: "bold" }}>{customerDelete?.email}</span>) ?</p>
            </Modal>
        </Fragment>

    );
};

export default Customers;