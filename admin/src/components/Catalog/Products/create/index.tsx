// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import React, { Fragment, useEffect, useState } from 'react';
import { Breadcrumb, Col, Row, Card, Form, Input, Switch, Button, Divider, Space, Table, Select, SelectProps, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { columns, data } from './columns';
import { default as ProductCreateBasic } from './ProductCreate'
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosClient } from 'src/helper/axiosInstance';
import { createProduct } from 'src/features/catalog/product/actions';
import ProductAssetCreate from './ProductAssetCreate';
import { ErrorValidateResponse } from 'src/types';
import { Box, Flex } from '@chakra-ui/react';
import ProductOptionsCreate from './ProductOptionsCreate';


const defaultValues = {
    name: '',
    slug: '',
    description: '',
    enabled: true
}

const options: SelectProps['options'] = [];
const ProductCreate: React.FC = () => {
    // ** State
    const [isSubmited, setIsSubmited] = useState<boolean>(false)
    const [enabled, setEnabled] = useState<boolean>(true);
    const [variantItem, setVariantItem] = useState<number[]>([0,1]);

    // ** Third party
    const navigate = useNavigate()
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({ defaultValues });

    // ** Variables
    const store = useAppSelector((state) => state.product);
    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    // Effect
    useEffect(() => {
        // ** Create product
        if (!store.createProduct.loading && isSubmited && !store.createProduct.error && store.createProduct.result) {
            setIsSubmited(false)
            navigate('catalog/products')
            message.success('Create product successfully!');
        }
        // ** Check product is have error
        if (!store.createProduct.loading && store.createProduct.error && store.createProduct.result) {
            const error = { ...store.createProduct.result }
            setError(error.fieldError, { message: error.message })
        }
    }, [
        store.createProduct.loading,
        isSubmited,
        store.createProduct.error
    ])

    // ** Function handle
    const onSubmit = async (data) => {
        // await createProduct({
        //     axiosClient,
        //     dispatch,
        //     product: {
        //         name: data.name,
        //         description: data.description,
        //         slug: data.slug,
        //         enabled: data.enabled
        //     }
        // })
        const { description, enabled, name, slug, ...options } = data
        const optColor = [];
        const optSize = [];
        const optMaterial = [];
        const optStyle = [];
        Object.keys(options).forEach((option) => {
            if (option.includes("optionName") && options[option] === 'color') {
                optColor.push({
                    code: options[`optionValue-${option.slice(-1)}`],
                    name: options[`optionValue-${option.slice(-1)}`]
                })
            } else if (option.includes("optionName") && options[option] === 'size') {
                optSize.push({
                    code: options[`optionValue-${option.slice(-1)}`],
                    name: options[`optionValue-${option.slice(-1)}`]
                })
            } else if (option.includes("optionName") && options[option] === 'material') {
                optMaterial.push({
                    code: options[`optionValue-${option.slice(-1)}`],
                    name: options[`optionValue-${option.slice(-1)}`]
                })
            } else {
                optStyle.push({
                    code: options[`optionValue-${option.slice(-1)}`],
                    name: options[`optionValue-${option.slice(-1)}`]
                })
            }
        });
        const color = {
            code: "color",
            name: "color",
            options: [...optColor]
        };
        const size = {
            code: "size",
            name: "size",
            options: [...optSize]
        }
        console.log({ size, color })

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
                            <Link to='/products'>Products</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Create</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Card>
                        <Form onFinish={handleSubmit(onSubmit)} autoComplete="off">
                            <Flex justifyContent="space-between" alignItems="center">
                                <Flex justifyContent="center" alignItems="center">
                                    <Switch checked={enabled} size='small' onChange={() => setEnabled(!enabled)} />
                                    <Box as="span" ml={2} fontWeight="semibold">Enabled</Box>
                                </Flex>
                                <Button type="primary" htmlType="submit">Create</Button>
                            </Flex>
                            <Divider />
                            <Row gutter={[24, 0]}>
                                <Col span={14}>
                                    {/* <ProductCreateBasic control={control} errors={errors} setValue={setValue} /> */}
                                    <ProductOptionsCreate control={control} />
                                </Col>
                                <Col span={10}>
                                    <ProductAssetCreate />
                                </Col>
                            </Row>
                            <div>
                                <Table bordered columns={columns()} dataSource={data({ control, errors, variantItem })} pagination={{ hideOnSinglePage: true }} />
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default ProductCreate;