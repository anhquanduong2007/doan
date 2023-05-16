import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Modal, Row, Space, Switch, Table, message } from 'antd';
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

interface DataType {
    key: number
    id: number
    category_name: string;
    category_code: string
    description: string
    active: number
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
            key: 'category_name',
        },
        {
            title: 'Category code',
            dataIndex: 'category_code',
            key: 'category_code',
        },
        {
            title: 'Description',
            ellipsis: true,
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (active: number) => {
                return (
                    <Switch checked={active === 1} />
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
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [categoryDelete, setCategoryDelete] = useState<{ id: number, name: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)

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
                take
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [skip, take, refresh])

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
                                <Table bordered columns={columns(setIsModalOpen, categoryDelete, setCategoryDelete, navigate)} dataSource={dataRender()} loading={category.list.loading} />
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