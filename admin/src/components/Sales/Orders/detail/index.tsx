import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Modal, Popover, Row, Tag, Timeline, Tooltip, message } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { cancelOrder, completedOrder, confirmOrder, deleteOrder, getOrder, refundOrder, shippedOrder } from 'src/features/sale/order/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { currency } from 'src/helper/currencyPrice';
import {
    UserOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { StatusOrder } from 'src/types'

const OrderDetail = () => {
    // ** State
    const [refresh, setRefresh] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params

    // ** Variables
    const order = useAppSelector((state) => state.order);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        if (id) {
            getOrder({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id, refresh])


    // ** Function handle
    const handleOk = () => {
        setIsModalOpen(false);
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
                        <Breadcrumb.Item>
                            <Link to='/sales/orders'>Orders</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{!order.single.loading && order.single.result ? order.single.result.code : null}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Row>
                        <Col span={24}>
                            <Flex justifyContent={"space-between"} alignItems={"center"}>
                                <Flex>
                                    <Box>
                                        {
                                            !order.single.loading && order.single.result ?
                                                (() => {
                                                    switch (order.single.result.status) {
                                                        case StatusOrder.Confirm:
                                                            return <Tag color="cyan">Confirm</Tag>
                                                        case StatusOrder.Shipped:
                                                            return <Tag color="orange">Shipped</Tag>
                                                        case StatusOrder.Completed:
                                                            return <Tag color="green">Completed</Tag>
                                                        case StatusOrder.Cancel:
                                                            return <Tag color="red">Cancel</Tag>
                                                        case StatusOrder.Refund:
                                                            return <Tag color="magenta">Refund</Tag>
                                                        default:
                                                            return <Tag color="blue">Open</Tag>
                                                    }
                                                })()
                                                : null
                                        }
                                    </Box>
                                    <Box>
                                        {!order.single.loading && order.single.result ? order.single.result.payment ? <Tag>Paid</Tag> : <Tag>Unpaid</Tag> : 0}
                                    </Box>
                                </Flex>
                                <Popover placement="leftTop" content={
                                    <Fragment>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && !order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && !order.single.result.payment
                                                    ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && !order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && !order.single.result.payment
                                                    ? 'unset' : 'none'
                                            }
                                            borderRadius={"4px"}
                                            onClick={() => {
                                                cancelOrder({
                                                    axiosClientJwt,
                                                    dispatch,
                                                    id: id ? +id : 0,
                                                    message,
                                                    navigate,
                                                    refresh,
                                                    setRefresh
                                                })
                                            }}
                                        >
                                            Cancel order
                                        </Box>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && order.single.result.payment
                                                    ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open && order.single.result.payment ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm && order.single.result.payment
                                                    ? 'unset' : 'none'
                                            }
                                            borderRadius={"4px"}
                                            onClick={() => {
                                                refundOrder({
                                                    axiosClientJwt,
                                                    dispatch,
                                                    id: id ? +id : 0,
                                                    message,
                                                    navigate,
                                                    refresh,
                                                    setRefresh
                                                })
                                            }}
                                        >
                                            Refund order
                                        </Box>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            borderRadius={"4px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Cancel ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Cancel && !order.single.result.payment ? 'unset' : 'none'
                                            }
                                            onClick={() => deleteOrder({
                                                axiosClientJwt,
                                                dispatch,
                                                id: id ? +id : 0,
                                                message,
                                                navigate,
                                                refresh,
                                                setRefresh
                                            })}
                                        >
                                            Delete order
                                        </Box>
                                        <Box
                                            _hover={{ background: '#dbdbdb' }}
                                            cursor={"pointer"}
                                            padding={"2px 5px"}
                                            opacity={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Shipped ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm
                                                    ? 1 : 0.5}
                                            pointerEvents={
                                                !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Open ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Shipped ||
                                                    !order.single.loading && order.single.result && order.single.result.status === StatusOrder.Confirm
                                                    ? 'unset' : 'none'
                                            }
                                            borderRadius={"4px"}
                                            onClick={() => {
                                                if (order.single.result?.status === StatusOrder.Open) {
                                                    confirmOrder({
                                                        axiosClientJwt,
                                                        dispatch,
                                                        id: id ? +id : 0,
                                                        message,
                                                        navigate,
                                                        refresh,
                                                        setRefresh
                                                    })
                                                }
                                                if (order.single.result?.status === StatusOrder.Confirm) {
                                                    shippedOrder({
                                                        axiosClientJwt,
                                                        dispatch,
                                                        id: id ? +id : 0,
                                                        message,
                                                        navigate,
                                                        refresh,
                                                        setRefresh
                                                    })
                                                }
                                                if (order.single.result?.status === StatusOrder.Shipped) {
                                                    completedOrder({
                                                        axiosClientJwt,
                                                        dispatch,
                                                        id: id ? +id : 0,
                                                        message,
                                                        navigate,
                                                        refresh,
                                                        setRefresh
                                                    })
                                                }
                                            }}
                                        >
                                            Manually transition to state...
                                        </Box>
                                    </Fragment>
                                } title="Order processing">
                                    <Button type="primary">{!order.single.loading && order.single.result ? order.single.result.status === StatusOrder.Completed ? null : 'Actions' : null}</Button>
                                </Popover>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Row>
                                    <Col span={24}>
                                        <Flex borderBottom={"1px solid #dbdbdb"} padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Product name</Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>SKU</Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Quantity</Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>Total</Flex>
                                        </Flex>
                                        <Flex borderBottom={"1px dashed #dbdbdb"} padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}>
                                                <img style={{ width: "32px", borderRadius: "100%" }} src={!order.single.loading && order.single.result ? order.single.result.product_variant.featured_asset?.url ? order.single.result.product_variant.featured_asset?.url : 'https://static.thenounproject.com/png/504708-200.png' : ''} />
                                            </Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}>{!order.single.loading && order.single.result ? order.single.result.product_variant.name : null}</Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}>{!order.single.loading && order.single.result ? order.single.result.product_variant.sku : null}</Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}>{!order.single.loading && order.single.result ? order.single.result.quantity : null}</Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"semibold"}>{!order.single.loading && order.single.result ? currency(order.single.result.quantity * order.single.result.product_variant.price) : "0"}</Flex>
                                        </Flex>
                                        <Flex borderBottom={"1px dashed #dbdbdb"} padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"bold"}>
                                                {!order.single.loading && order.single.result ? order.single.result?.promotion ? order.single.result.promotion.coupon_code : null : null}
                                            </Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"semibold"}>{!order.single.loading && order.single.result ? order.single.result.promotion ? `-${order.single.result.promotion.discount}% (-${currency(order.single.result.quantity * order.single.result.product_variant.price * (1 - (100 - order.single.result.promotion.discount) / 100))})` : '0' : '0'}</Flex>
                                        </Flex>
                                        <Flex padding={"10px 0"} justifyContent={"center"} alignItems={"center"}>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"}></Flex>
                                            <Flex flex={1} justifyContent={"center"} alignItems={"center"} fontWeight={"semibold"}>{!order.single.loading && order.single.result ? currency(order.single.result.total_price) : 0}</Flex>
                                        </Flex>
                                    </Col>
                                    <Divider />
                                    <Col span={24}>
                                        <Row gutter={[12, 12]}>
                                            <Col span={12}>
                                                <Row gutter={[0, 12]}>
                                                    <Col span={24}>
                                                        <Card title={
                                                            !order.single.loading && order.single.result ? (
                                                                <Flex alignItems={"center"}>
                                                                    <UserOutlined />
                                                                    <Link to={`customers/update/${order.single.result.users.id}`} style={{ marginLeft: "5px" }}>{order.single.result.users.first_name + order.single.result.users.last_name}</Link>
                                                                </Flex>
                                                            ) : null
                                                        }>
                                                            <Tooltip title={`Street line 1: ${!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_1 : null}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Street line 1: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_1 : null}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Street line 2: ${!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_2 ? order.single.result.billing_address.street_line_2 : '-' : null}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Street line 2: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_2 ? order.single.result.billing_address.street_line_2 : '-' : null}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`City: ${!order.single.loading && order.single.result ? order.single.result.billing_address.city : null}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">City: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.city : null}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Country: ${!order.single.loading && order.single.result ? order.single.result.billing_address.country : null}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Country: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.country : null}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Postal code: ${!order.single.loading && order.single.result ? order.single.result.billing_address.postal_code : null}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Postal code: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.postal_code : null}
                                                                </p>
                                                            </Tooltip>
                                                            <Tooltip title={`Province: ${!order.single.loading && order.single.result ? order.single.result.billing_address.province : null}`}>
                                                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                    <Box as="span" fontWeight="semibold">Province: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.province : null}
                                                                </p>
                                                            </Tooltip>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col span={12}>
                                                <Timeline>
                                                    {
                                                        !order.single.loading && order.single.result ? (
                                                            order.single.result.order_history.map((history, index) => {
                                                                return (
                                                                    <Timeline.Item key={index}>{`${history.content} at ${new Date(history.created_date).toISOString().substring(0, 10)} - ${moment(history.created_date).utc().format('HH:mm:ss')}`}</Timeline.Item>
                                                                )
                                                            })
                                                        ) : ''
                                                    }
                                                </Timeline>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default OrderDetail;