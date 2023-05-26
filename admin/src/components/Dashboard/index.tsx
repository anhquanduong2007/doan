import { Box, Flex } from '@chakra-ui/react';
import { Card, Col, Row, Divider, DatePicker, InputNumber } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { Pie, Column } from '@ant-design/plots';
import { createAxiosClient } from 'src/helper/axiosInstance';
import type { DatePickerProps } from 'antd';
import moment, { Moment } from 'moment';
import { Order, ProductVariant, User } from 'src/types';
import { currency } from 'src/helper/currencyPrice';
import { Link } from 'react-router-dom';
import Button from 'antd-button-color';
interface Dashboard {
    totalCustomers: number
    totalProducts: number
    totalAdministrators: number,
    totalOrders: number,
    totalOrdersOpen: number,
    totalOrderConfirm: number,
    totalOrderShipped: number,
    totalOrderCompleted: number,
    totalOrderRefund: number,
    totalOrderCancel: number
    potentialCustomers: Array<{ _sum: { total_price: number }, user: User }>,
    salesReport: Array<Order>
    hotSellingProducts: Array<{ _sum: { product_variant_id: number }, variant: ProductVariant }>
}

const dateFormat = 'YYYY/MM/DD';

const Dashboard = () => {
    // ** State
    const [dashboard, setDashboard] = useState<Dashboard>()
    const [money, setMoney] = useState<number>(1000)
    const [startDate, setStartDate] = useState<string>()
    const [endDate, setEndDate] = useState<string>()


    // ** Variables
    const axiosClient = createAxiosClient();

    // ** Effect 
    useEffect(() => {
        axiosClient.get('/dashboard', {
            params: {
                start_day: startDate,
                end_day: endDate,
                money
            }
        }).then((r) => {
            const d = { ...r } as unknown as { response: Dashboard }
            setDashboard(d.response)
        })
    }, [startDate, endDate, money])

    // ** Function handle
    const onChange = (value: number | null) => {
        setMoney(value as number)
    };

    const onChangeStartDate: DatePickerProps['onChange'] = (date, dateString) => {
        setStartDate(date?.toISOString() as string)
    };

    const onChangeEndDate: DatePickerProps['onChange'] = (date, dateString) => {
        setEndDate(date?.toISOString() as string)
    };

    return (
        <Fragment>
            <Row>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Total products</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalProducts}</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card >
                                <Box color="#8c8c8c" fontWeight={600}>Total customers</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalCustomers}</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Total administrators</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalAdministrators}</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Total orders</Box>
                                <Box fontWeight="bold" fontSize="3xl">{dashboard?.totalOrders}</Box>
                            </Card>
                        </Col>
                        <Col span={24} style={{ marginTop: "1rem" }}>
                            <Row gutter={[16, 16]}>
                                <Col span={14}>
                                    <Card title="Hot Selling Products">
                                        <Column
                                            data={dashboard ? dashboard.hotSellingProducts?.map((product) => {
                                                return {
                                                    sales: product._sum.product_variant_id,
                                                    type: `${product.variant.name} (${product.variant.sku})`
                                                }
                                            }) : []}
                                            xField='type'
                                            yField='sales'
                                            label={{
                                                position: 'middle',
                                                style: {
                                                    fill: '#FFFFFF',
                                                    opacity: 0.6,
                                                },
                                            }}
                                            xAxis={{
                                                label: {
                                                    autoHide: true,
                                                    autoRotate: false,
                                                },
                                            }}
                                        />
                                    </Card>
                                </Col>
                                <Col span={10}>
                                    <Card title="Order Status">
                                        <Pie
                                            appendPadding={10}
                                            data={dashboard ? [

                                                {
                                                    type: 'Open',
                                                    value: dashboard.totalOrdersOpen,
                                                },
                                                {
                                                    type: 'Confirm',
                                                    value: dashboard.totalOrderConfirm,
                                                },
                                                {
                                                    type: 'Shipped',
                                                    value: dashboard.totalOrderShipped,
                                                },
                                                {
                                                    type: 'Completed',
                                                    value: dashboard.totalOrderCompleted,
                                                },
                                                {
                                                    type: 'Refund',
                                                    value: dashboard.totalOrderRefund,
                                                },
                                                {
                                                    type: 'Cancel',
                                                    value: dashboard.totalOrderCancel,
                                                },
                                            ] : []}
                                            angleField='value'
                                            colorField='type'
                                            radius={0.9}
                                            label={{
                                                type: 'inner',
                                                offset: '-30%',
                                                style: {
                                                    fontSize: 14,
                                                    textAlign: 'center',
                                                },
                                            }}
                                            interactions={[{ type: 'element-active' }]}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row style={{ marginTop: "1rem" }} gutter={[16, 16]}>
                                <Col span={10}>
                                    <Card title="Potential Customers">
                                        <Row>
                                            <Col span={24}>
                                                <InputNumber
                                                    value={money}
                                                    style={{ width: "100%" }}
                                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    onChange={onChange}
                                                />
                                            </Col>
                                            <Divider />
                                            <Col span={24}>
                                                {
                                                    dashboard?.potentialCustomers && (
                                                        <Fragment>
                                                            <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"} justifyContent="space-between">
                                                                <Box flex={1} fontWeight="bold">Name</Box>
                                                                <Box flex={1} fontWeight="bold">Email</Box>
                                                                <Box flex={1} fontWeight="bold">Total</Box>
                                                            </Flex>
                                                            {
                                                                dashboard.potentialCustomers.map((customer, index) => {
                                                                    return (
                                                                        <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"} justifyContent="space-between" key={index}>
                                                                            <Box flex={1}>{customer.user.first_name + customer.user.last_name}</Box>
                                                                            <Box flex={1}>{customer.user.email}</Box>
                                                                            <Box flex={1}>{currency(customer._sum.total_price)}</Box>
                                                                        </Flex>
                                                                    )
                                                                })
                                                            }
                                                        </Fragment>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={14}>
                                    <Card title="Sales Report">
                                        <Row>
                                            <Col span={24}>
                                                <Flex mb={"14px"}>
                                                    <Flex flex={1} mr={4} alignItems="center">
                                                        <span style={{ marginRight: "8px" }}>From</span>
                                                        <DatePicker style={{ width: "100%" }} onChange={onChangeStartDate} />
                                                    </Flex>
                                                    <Flex flex={1} alignItems="center">
                                                        <span style={{ marginRight: "8px" }}>To</span>
                                                        <DatePicker style={{ width: "100%" }} onChange={onChangeEndDate} />
                                                    </Flex>
                                                </Flex>
                                                <Box as="p">Number of products sold: <Box as="span" fontWeight="bold">{dashboard?.salesReport?.length}</Box></Box>
                                                <Box as="p">Total revenue (paid): <Box as="span" fontWeight="bold" color="green">+{dashboard?.salesReport?.length ? currency(dashboard?.salesReport.filter(({ payment }) => payment).reduce((prev, current) => prev + current.total_price, 0)) : 0}</Box></Box>
                                                <Box as="p">Total revenue (unpaid): <Box as="span" fontWeight="bold" color="red">-{dashboard?.salesReport?.length ? currency(dashboard?.salesReport.filter(({ payment }) => !payment).reduce((prev, current) => prev + current.total_price, 0)) : 0}</Box></Box>
                                                <Box as="p">Total revenue: <Box as="span" fontWeight="bold">{dashboard?.salesReport?.length ? currency(dashboard?.salesReport.reduce((prev, current) => prev + current.total_price, 0)) : 0}</Box></Box>
                                            </Col>
                                            <Divider />
                                            <Col span={24}>
                                                {
                                                    dashboard?.salesReport && (
                                                        <Fragment>
                                                            <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"} justifyContent="space-between">
                                                                <Box flex={2} fontWeight="bold">Order code</Box>
                                                                <Box flex={1} fontWeight="bold">Price</Box>
                                                                <Box flex={1} fontWeight="bold">Quantity</Box>
                                                                <Box flex={1} fontWeight="bold">Payment method</Box>
                                                                <Box flex={1} fontWeight="bold"></Box>
                                                            </Flex>
                                                            {
                                                                dashboard.salesReport.map((order, index) => {
                                                                    return (
                                                                        <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"} justifyContent="space-between" key={index}>
                                                                            <Box flex={2}>{order.code}</Box>
                                                                            <Box flex={1}>{currency(order.total_price)}</Box>
                                                                            <Box flex={1}>{order.quantity}</Box>
                                                                            <Box flex={1}>{order.payment_method}</Box>
                                                                            <Box flex={1}>
                                                                                <Button>
                                                                                    <Link to={`/sales/orders/detail/${order.id}`}>Open</Link>
                                                                                </Button>
                                                                            </Box>
                                                                        </Flex>
                                                                    )
                                                                })
                                                            }
                                                        </Fragment>
                                                    )
                                                }
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Dashboard;