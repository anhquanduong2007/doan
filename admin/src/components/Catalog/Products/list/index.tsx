import React, { Fragment } from 'react';
import { Breadcrumb, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
    return (
        <Fragment>
            <Row>
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Products</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
        </Fragment>
    );
};

export default Products;