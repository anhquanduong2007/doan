import { UserOutlined } from '@ant-design/icons';
import { Box, Flex } from '@chakra-ui/react';
import { Card, Col, Row, Tooltip } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'src/app/hooks';

const UserOrderAddress = () => {
    const order = useAppSelector((state) => state.order);

    return (
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
    );
};

export default UserOrderAddress;