import { Box, Flex } from '@chakra-ui/react';
import { Card, Col, Divider, Form, Input, Popover, Row, Switch, Tag } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getProduct } from 'src/features/catalog/product/actions';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import {
    EllipsisOutlined
} from '@ant-design/icons';
import ModalUpdateProductVariant from './ModalUpdateProductVariant';
import { ProductVariant as ProductVariantType } from 'src/types';

const ProductVariant = () => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variant, setVariant] = useState<ProductVariantType>()
    const [refresh, setRefresh] = useState<boolean>(false)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params

    // ** Variables
    const product = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        if (id) {
            getProduct({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id, refresh])

    // ** Function handle
    const dataToRender = () => {
        if (!product.single.loading && product.single.result && product.single.result.product_variants && product.single.result.product_variants.length) {
            return product.single.result.product_variants.map((product_variant, index) => {
                return (
                    <Card key={index} style={{ marginBottom: "1rem" }}>
                        <Flex justifyContent={"flex-end"}>
                            <Box padding={"0 12px"}>
                                <Popover
                                    placement="left"
                                    content={
                                        <Fragment>
                                            <Box
                                                _hover={{ background: '#dbdbdb' }}
                                                cursor={"pointer"}
                                                padding={"2px 5px"}
                                                borderRadius={"4px"}
                                                onClick={() => {
                                                    setIsModalOpen(true)
                                                    setVariant(product_variant)
                                                }}
                                            >
                                                Update
                                            </Box>
                                        </Fragment>
                                    }
                                    title="Action"
                                >
                                    <EllipsisOutlined style={{ cursor: "pointer" }} />
                                </Popover>
                            </Box>
                        </Flex>
                        <Divider />
                        <Row gutter={[16, 16]}>
                            <Col span={5}>
                                <Flex flexDirection={'column'} alignItems={"flex-start"}>
                                    <Box border={"1px solid #dbdbdb"} borderRadius={"10px"} w={"100%"}>
                                        <img
                                            style={{ width: "100%", padding: "10px", height: "300px", objectFit: "contain" }}
                                            src={product_variant.featured_asset ? product_variant.featured_asset.url : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'}
                                        />
                                    </Box>
                                    <Box mt={4}>
                                        {product_variant.product_options.map((option) => {
                                            return (
                                                <Tag color="blue">{option.product_option.value}</Tag>
                                            )
                                        })}
                                    </Box>
                                </Flex>
                            </Col>
                            <Col span={19}>
                                <Form layout='vertical'>
                                    <Form.Item label="SKU">
                                        <Input disabled value={product_variant.sku} />
                                    </Form.Item>
                                    <Form.Item label="Product variant name">
                                        <Input disabled value={product_variant.name} />
                                    </Form.Item>
                                    <Form.Item label="Price">
                                        <Input disabled value={product_variant.price} />
                                    </Form.Item>
                                    <Form.Item label="Stock">
                                        <Input disabled value={product_variant.stock} />
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                )
            })
        }
        return []
    }

    return (
        <Fragment>
            {dataToRender()}
            <ModalUpdateProductVariant isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} variant={variant as ProductVariantType} refresh={refresh} setRefresh={setRefresh} />
        </Fragment>
    );
};

export default ProductVariant;