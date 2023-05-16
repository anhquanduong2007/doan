import { Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Modal, Row, Space, Switch, Table, Tag, message } from 'antd';
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
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [promotionDelete, setPromotionDelete] = useState<{ id: number, name: string }>()
    const [refresh, setRefresh] = useState<boolean>(false)

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
                take
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [skip, take, refresh])

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
                                <Table bordered columns={columns(setIsModalOpen, promotionDelete, setPromotionDelete, navigate)} dataSource={dataRender()} loading={promotion.list.loading} />
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