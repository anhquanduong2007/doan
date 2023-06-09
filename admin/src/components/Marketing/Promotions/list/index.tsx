import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Select, Space, Switch, Table, Tag, message } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { deletePromotion, getListPromotion } from 'src/features/promotion/action';
import { useDebounce } from 'use-debounce';

interface DataType {
    key: number
    id: number
    starts_at: string;
    ends_at: string
    coupon_code: string
    active: number
    name: string
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    promotionDelete: { id: number, name: string } | undefined,
    setPromotionDelete: ({ id, name }: { id: number, name: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Promotion name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Coupon code',
            dataIndex: 'coupon_code',
            key: 'coupon_code',
            render: (coupon_code: string) => {
                return (
                    <Tag>{coupon_code}</Tag>
                )
            }
        },
        {
            title: 'Starts at',
            dataIndex: 'starts_at',
            key: 'starts_at',
            render: (starts_at: string) => {
                return (
                    <span>{new Date(starts_at).toISOString().substring(0, 10)}</span>
                )
            }
        },
        {
            title: 'Ends at',
            dataIndex: 'ends_at',
            key: 'ends_at',
            render: (ends_at: string) => {
                return (
                    <span>{new Date(ends_at).toISOString().substring(0, 10)}</span>
                )
            }
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
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setPromotionDelete({
                                ...promotionDelete,
                                id: record.id,
                                name: record.name
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const Promotions = () => {
    // ** State
    const [take, setTake] = useState<number>(10)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [promotionDelete, setPromotionDelete] = useState<{ id: number, name: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);
    const [status, setStatus] = useState<string>('all')

    // ** Variables
    const promotion = useAppSelector((state) => state.promotion);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Third party
    const navigate = useNavigate()

    // ** Effect
    useEffect(() => {
        getListPromotion({
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
    }, [skip, take, value, refresh, status])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!promotion.list.loading && promotion.list.result) {
            return promotion.list.result.promotions.map((promotion, index: number) => {
                return {
                    key: index,
                    id: promotion.id,
                    active: promotion.active,
                    coupon_code: promotion.coupon_code,
                    ends_at: promotion.ends_at,
                    name: promotion.name,
                    starts_at: promotion.starts_at
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deletePromotion({
            axiosClientJwt,
            dispatch,
            navigate,
            id: promotionDelete?.id!,
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
                        <Breadcrumb.Item>Promotions</Breadcrumb.Item>
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
                                    Create new promotion
                                </Button>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, promotionDelete, setPromotionDelete, navigate)}
                                    dataSource={dataRender()}
                                    loading={promotion.list.loading}
                                    pagination={{
                                        total: promotion.list.result?.total,
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
            <Modal title="Delete role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={promotion.delete.loading}>
                <p>Do you want to delete this category (<span style={{ fontWeight: "bold" }}>{promotionDelete?.name}</span>)?</p>
            </Modal>
        </Fragment>
    );
};

export default Promotions;