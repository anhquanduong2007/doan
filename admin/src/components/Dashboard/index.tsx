import { Box } from '@chakra-ui/react';
import { Card, Col, Row } from 'antd';
import React, { Fragment } from 'react';

const Dashboard = () => {
    return (
        <Fragment>
            <Row>
                <Col span={24}>
                    <Row gutter={[16, 0]}>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Total products</Box>
                                <Box fontWeight="bold" fontSize="3xl">100</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card >
                                <Box color="#8c8c8c" fontWeight={600}>Total customers</Box>
                                <Box fontWeight="bold" fontSize="3xl">100</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Total administrators</Box>
                                <Box fontWeight="bold" fontSize="3xl">100</Box>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Box color="#8c8c8c" fontWeight={600}>Total orders</Box>
                                <Box fontWeight="bold" fontSize="3xl">100</Box>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Dashboard;