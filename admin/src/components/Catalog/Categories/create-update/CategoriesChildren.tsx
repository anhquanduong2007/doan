import { Button, Card, Col, Modal, Row, Space, Switch, Table, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import {
    EditOutlined,
    DeleteOutlined,
    RollbackOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { deleteCategory, getListCategoryChildren, removeCategoryParent } from 'src/features/catalog/category/action';
import type { ColumnsType } from 'antd/es/table';
import { AxiosInstance } from 'axios';
import { AppDispatch } from 'src/app/store';

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
    navigate: NavigateFunction,
    id: number,
    axiosClientJwt: AxiosInstance,
    dispatch: AppDispatch,
    refresh: boolean,
    setRefresh: (refresh: boolean) => void,
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
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/catalog/categories/update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setCategoryDelete({
                                ...categoryDelete,
                                id: record.id,
                                name: record.category_name
                            })
                        }} />
                        <Button icon={<RollbackOutlined />} shape="circle" onClick={() => {
                            removeCategoryParent({
                                axiosClientJwt,
                                dispatch,
                                id,
                                message,
                                navigate,
                                refresh,
                                setRefresh,
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const CategoriesChildren = () => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [categoryDelete, setCategoryDelete] = useState<{ id: number, name: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)

    // ** Variables
    const category = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Third party
    const params = useParams()
    const { id } = params
    const navigate = useNavigate()

    // ** Effect
    useEffect(() => {
        if (id) {
            getListCategoryChildren({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!category.children.loading && category.children.result) {
            return category.children.result.map((category, index: number) => {
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
            <Row>
                <Col span={24}>
                    <Table
                        bordered
                        columns={
                            columns(
                                setIsModalOpen,
                                categoryDelete,
                                setCategoryDelete,
                                navigate,
                                id ? +(id) : 0,
                                axiosClientJwt,
                                dispatch,
                                refresh,
                                setRefresh
                            )}
                        dataSource={dataRender()}
                        loading={category.list.loading}
                        pagination={false}
                    />
                </Col>
            </Row>
            <Modal title="Delete role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={category.delete.loading}>
                <p>Do you want to delete this category (<span style={{ fontWeight: "bold" }}>{categoryDelete?.name}</span>)?</p>
            </Modal>
        </Fragment>
    );
};

export default CategoriesChildren;

