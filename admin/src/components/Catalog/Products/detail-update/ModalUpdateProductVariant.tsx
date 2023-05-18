import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ProductVariant } from 'src/types';

export interface FormValuesProductVariant {
    name: string
    sku: string
    price: number
    stock: number
}


interface ModalUpdateProductVariantProps {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void
    variant: ProductVariant
}
const ModalUpdateProductVariant = ({ isModalOpen, setIsModalOpen, variant }: ModalUpdateProductVariantProps) => {

    // ** Ref
    const skuErrorRef = useRef(null);
    const nameErrorRef = useRef(null);

    // ** Third party
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesProductVariant>({
        defaultValues: {
            name: '',
            sku: '',
            price: 0,
            stock: 0
        }
    });

    // ** Effect
    useEffect(() => {
        skuErrorRef.current && autoAnimate(skuErrorRef.current);
        nameErrorRef.current && autoAnimate(nameErrorRef.current);
    }, [parent])

    // ** Function handle
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal title="Update product variant" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered width={"80%"}>
            <Form layout='vertical'>
                <Row gutter={[16, 16]}>
                    <Col span={19}>
                        <Form.Item label="Product name">
                            <Controller
                                name="name"
                                rules={{ required: true }}
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div ref={nameErrorRef}>
                                            <Input {...field} placeholder="Eg: Shirt sm" value={variant?.name || ''} />
                                            {errors?.name ? <Box as="div" mt={1} textColor="red.600">{errors.name?.type === 'required' ? "Please input your product variant name!" : errors.name.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="SKU">
                            <Controller
                                name="sku"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => {
                                    return (
                                        <div ref={skuErrorRef}>
                                            <Input {...field} placeholder="sm-0152" value={variant?.sku || ''} />
                                            {errors?.sku ? <Box as="div" mt={1} textColor="red.600">{errors.sku?.type === 'required' ? "Please input your product sku!" : errors.sku.message}</Box> : null}
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Price">
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div >
                                            <InputNumber
                                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                {...field}
                                                value={variant?.price || ''}
                                            />
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Stock">
                            <Controller
                                name="stock"
                                control={control}
                                render={({ field }) => {
                                    return (
                                        <div >
                                            <InputNumber {...field} value={variant?.stock || ''} />
                                        </div>
                                    )
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Flex flexDirection={'column'} alignItems={"center"}>
                            {/* <Box border={"1px solid #dbdbdb"} borderRadius={"10px"} w={"100%"}>
                                <img
                                    style={{ width: "100%", padding: "10px", height: "300px", objectFit: "contain" }}
                                    src={featuredAsset ? featuredAsset.url : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'}
                                />
                            </Box> */}
                            {/* <Button onClick={() => setIsModalAssetOpen(true)} style={{ marginTop: "10px" }}>Select image</Button> */}
                        </Flex>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ModalUpdateProductVariant;