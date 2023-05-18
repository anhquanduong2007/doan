import { Box, Flex } from '@chakra-ui/react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import autoAnimate from '@formkit/auto-animate';
import { Button, Col, Divider, Form, Input, Row, Select, Switch, message } from 'antd';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getProduct, updateProduct } from 'src/features/catalog/product/actions';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import { Asset } from 'src/types/asset';
import SelectImage from '../SelectImage';
import { getListCategory } from 'src/features/catalog/category/action';

export interface FormValuesProduct {
    name: string
    slug: string
}

interface ItemProps {
    label: string;
    value: number;
}


const ProductDetail = () => {
    // ** State
    const [description, setDescription] = useState<string>('')
    const [active, setActive] = useState<number>(1)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [featuredAsset, setFeaturedAsset] = useState<Asset>()
    const [isModalAssetOpen, setIsModalAssetOpen] = useState<boolean>(false);
    const [categoryId, setCategoryId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesProduct>({
        defaultValues: {
            name: '',
            slug: '',
        }
    });

    // ** Variables
    const product = useAppSelector((state) => state.product);
    const category = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Ref
    const slugErrorRef = useRef(null);
    const productNameErrorRef = useRef(null);

    // ** Effect
    useEffect(() => {
        if (id) {
            getProduct({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
            getListCategory({
                axiosClientJwt,
                dispatch,
                navigate,
                pagination: {
                    skip: 0,
                    take: 999
                }
            })
        }
    }, [id])

    useEffect(() => {
        slugErrorRef.current && autoAnimate(slugErrorRef.current);
        productNameErrorRef.current && autoAnimate(productNameErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id && !product.single.loading && product.single.result) {
            setValue("name", product.single.result.name)
            setValue("slug", product.single.result.slug)
            setDescription(product.single.result.description || '')
            setActive(product.single.result.active)
            setFeaturedAsset(product.single.result.featured_asset)
            setCategoryId(product.single.result.category_id)
        }
    }, [id, product.single.loading, product.single.result])

    const onSubmit = async (data: FormValuesProduct) => {
        if (id) {
            await updateProduct({
                product: {
                    active,
                    name: data.name,
                    slug: data.slug,
                    description,
                    featured_asset_id: featuredAsset?.id,
                    category_id: categoryId
                },
                axiosClientJwt,
                dispatch,
                id: +id,
                message,
                navigate,
                setError,
                refresh,
                setRefresh
            })
        }
    }
    const dataCategories = (): ItemProps[] => {
        if (id && !category.list.loading && category.list.result) {
            return category.list.result.categories.map((category) => {
                return {
                    label: category.category_name,
                    value: category.id
                }
            })
        }
        return []
    }

    return (
        <Fragment>
            <Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
                <Row>
                    <Col span={24}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Flex justifyContent="center" alignItems="center">
                                <Switch checked={active === 1} size='small' onChange={() => setActive(active === 1 ? 0 : 1)} />
                                <Box as="span" ml={2} fontWeight="semibold">Active</Box>
                            </Flex>
                            {
                                id && product.update.loading ?
                                    <Button type="primary" loading>Updating...</Button> :

                                    <Button htmlType="submit" type="primary">Update</Button>
                            }
                        </Flex>
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            <Col span={19}>
                                <Form.Item label="Product name">
                                    <Controller
                                        name="name"
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <div ref={productNameErrorRef}>
                                                    <Input {...field} placeholder="Eg: Quan" />
                                                    {errors?.name ? <Box as="div" mt={1} textColor="red.600">{errors.name?.type === 'required' ? "Please input your product name!" : errors.name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Slug">
                                    <Controller
                                        name="slug"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={slugErrorRef}>
                                                    <Input {...field} placeholder="Eg: Quan" />
                                                    {errors?.slug ? <Box as="div" mt={1} textColor="red.600">{errors.slug?.type === 'required' ? "Please input your product slug!" : errors.slug.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Description">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={description}
                                        onChange={(_event, editor) => {
                                            setDescription(editor.getData())
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Category">
                                    <Select
                                        loading={category.list.loading}
                                        value={categoryId}
                                        onChange={(value: number) => setCategoryId(value)}
                                        options={[
                                            {
                                                label: "None",
                                                value: null
                                            },
                                            ...dataCategories()
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Flex flexDirection={'column'} alignItems={"center"}>
                                    <Box border={"1px solid #dbdbdb"} borderRadius={"10px"} w={"100%"}>
                                        <img
                                            style={{ width: "100%", padding: "10px", height: "300px", objectFit: "contain" }}
                                            src={featuredAsset ? featuredAsset.url : 'https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132484366.jpg'}
                                        />
                                    </Box>
                                    <Button onClick={() => setIsModalAssetOpen(true)} style={{ marginTop: "10px" }}>Select image</Button>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <SelectImage isModalAssetOpen={isModalAssetOpen} setIsModalAssetOpen={setIsModalAssetOpen} setFeaturedAsset={setFeaturedAsset} featuredAsset={featuredAsset as Asset} />
        </Fragment>
    );
};

export default ProductDetail;