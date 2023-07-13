import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Select, Space, Table, Tag, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { deleteCategory, getListCategory } from 'src/features/catalog/category/action';
import type { ColumnsType } from 'antd/es/table';
import { useDebounce } from 'use-debounce';

interface DataType {
    key: number
    id: number
    category_name: string;
    category_code: string
    description: string
    active: boolean
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    categoryDelete: { id: number, name: string } | undefined,
    setCategoryDelete: ({ id, name }: { id: number, name: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Category name',
            dataIndex: 'category_name',
            ellipsis: true,
            key: 'category_name',
            width: '15%',
            fixed: 'left'
        },
        {
            title: 'Category code',
            dataIndex: 'category_code',
            ellipsis: true,
            key: 'category_code',
            width: '15%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Active',
            dataIndex: 'active',
            ellipsis: true,
            key: 'active',
            width: '100px',
            render: (active: number) => {
                return (
                    <Tag color={active ? 'green' : 'gold'}>{active ? 'Active' : 'Disabled'}</Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: '150px',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setCategoryDelete({
                                ...categoryDelete,
                                id: record.id,
                                name: record.category_name
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const Categories = () => {
    // ** State
    const [take, setTake] = useState<number>(10)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [categoryDelete, setCategoryDelete] = useState<{ id: number, name: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Variables
    const category = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Third party
    const navigate = useNavigate()

    // ** Effect
    useEffect(() => {
        getListCategory({
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
        if (!category.list.loading && category.list.result) {
            return category.list.result.categories.map((category, index: number) => {
                return {
                    key: index,
                    id: category.id,
                    category_code: category.category_code,
                    category_name: category.category_name,
                    active: category.active,
                    description: category.description
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteCategory({
            axiosClientJwt,
            dispatch,
            navigate,
            id: categoryDelete?.id!,
            refresh,
            setIsModalOpen,
            setRefresh,
            message
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOnChangePagination = (e: number) => {
        setSkip((e - 1) * take)
    }

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
                        <Breadcrumb.Item>Categories</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"flex-end"} alignItems={"center"}>
                                <Box mr={3} flex={2}>
                                    <Input type='text' placeholder='Search by promotion...' onChange={(e) => { setSearch(e.target.value); }} />
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
                                    Create new category
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, categoryDelete, setCategoryDelete, navigate)}
                                    dataSource={dataRender()}
                                    scroll={{ x: '100vw' }}
                                    loading={category.list.loading}
                                    pagination={{
                                        total: category.list.result?.total,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                        defaultCurrent: skip + 1,
                                        onChange: handleOnChangePagination,
                                        defaultPageSize: take,
                                        responsive: true
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Delete role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={category.delete.loading}>
                <p>Do you want to delete this category (<span style={{ fontWeight: "bold" }}>{categoryDelete?.name}</span>)?</p>
            </Modal>
        </Fragment>
    );
};

export default Categories;