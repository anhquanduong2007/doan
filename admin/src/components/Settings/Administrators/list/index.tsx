import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Select, Space, Table, Tag, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import { Box, Flex } from '@chakra-ui/react';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { deleteAdministrator, getListAdministrator } from 'src/features/setting/administrator/action';
import type { ColumnsType } from 'antd/es/table';
import { useDebounce } from 'use-debounce';

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
    administratorDelete: { id: number, email: string } | undefined,
    setAdministratorDelete: ({ id, email }: { id: number, email: string }) => void,
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
                    <Tag color={active === 1 ? 'green' : 'gold'}>{active === 1 ? 'Active' : 'Disabled'}</Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                if (record.email === "superadmin@gmail.com") {
                    return null
                }
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setAdministratorDelete({
                                ...administratorDelete,
                                id: record.id,
                                email: record.email
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const AdministratorList = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [administratorDelete, setAdministratorDelete] = useState<{ id: number, email: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const store = useAppSelector((state) => state.administrator);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        getListAdministrator({
            pagination: {
                skip,
                take,
                search: value,
                status
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [skip, take, refresh, value, status])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!store.list.loading && store.list.result) {
            return store.list.result.administrators.map((administrator, index: number) => {
                return {
                    key: index,
                    id: administrator.id,
                    email: administrator.email,
                    first_name: administrator.first_name,
                    last_name: administrator.last_name,
                    phone: administrator.phone,
                    active: administrator.active
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteAdministrator({
            axiosClientJwt,
            dispatch,
            navigate,
            id: administratorDelete?.id!,
            refresh,
            setIsModalOpen,
            setRefresh,
            message
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onChangeStatus = (value: string) => {
        setStatus(value)
    };

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Administrators</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}>
                                <Box mr={3} flex={1}>
                                    <Input type='text' placeholder='Search...' onChange={(e) => { setSearch(e.target.value); }} />
                                </Box>
                                <Box mr={3} flex={1}>
                                    <Select
                                        value={status}
                                        placeholder="Status"
                                        onChange={onChangeStatus}
                                        options={[
                                            {
                                                value: 'all',
                                                label: 'All',
                                            },
                                            {
                                                value: 'active',
                                                label: 'Active',
                                            },
                                            {
                                                value: 'disabled',
                                                label: 'Disabled',
                                            },
                                        ]}
                                    />
                                </Box>
                                <Button
                                    style={{ textTransform: "uppercase" }}
                                    type="primary"
                                    onClick={() => navigate('create')}
                                    icon={<PlusCircleOutlined />}
                                >
                                    Create new Administrator
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table bordered columns={columns(setIsModalOpen, administratorDelete, setAdministratorDelete, navigate)} dataSource={dataRender()} loading={store.list.loading} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Delete role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={store.delete.loading}>
                <p>Do you want to delete this administrator (<span style={{ fontWeight: "bold" }}>{administratorDelete?.email}</span>) ?</p>
            </Modal>
        </Fragment>

    );
};

export default AdministratorList;