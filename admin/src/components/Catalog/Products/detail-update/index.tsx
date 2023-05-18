import { Breadcrumb, Card, Col, Divider, Row, Tabs } from 'antd';
import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import ProductVariant from './ProductVariant';

const ProductDetailUpdate = () => {
    // ** Third party
    const params = useParams()
    const { id } = params

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/catalog/products'>Products</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Divider />
                <Col span={24}>
                    <Card>
                        <Tabs defaultActiveKey="1">
                            <Tabs.TabPane tab="Product details" key="1">
                                <ProductDetail />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Product variants" key="2">
                                <ProductVariant />
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default ProductDetailUpdate;