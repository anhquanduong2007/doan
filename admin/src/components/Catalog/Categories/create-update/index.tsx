import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Card, Col, Divider, Row, Switch, Form, Button, Input, Select, message } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createCategory, getCategory, getListCategory, getListCategoryChildren, updateCategory } from 'src/features/catalog/category/action';
import { createAxiosJwt } from 'src/helper/axiosInstance';
import CategoriesChildren from './CategoriesChildren';

export type FormValuesCategory = {
    category_name: string
    category_code: string
    description: string
}

interface ItemProps {
    label: string;
    value: number;
}

const CategoryCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<number>(1)
    const [parentId, setParentId] = useState<number | null>(null)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesCategory>({
        defaultValues: {
            category_name: '',
            category_code: '',
            description: '',
        }
    });

    // ** Ref
    const categoryNameErrorRef = useRef(null);
    const categoryCodeErrorRef = useRef(null);

    // ** Variables
    const category = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Effect
    useEffect(() => {
        categoryNameErrorRef.current && autoAnimate(categoryNameErrorRef.current);
        categoryCodeErrorRef.current && autoAnimate(categoryCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getCategory({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
        getListCategory({
            pagination: {
                skip: 0,
                take: 999
            },
            navigate,
            axiosClientJwt,
            dispatch,
        })
    }, [id])

    useEffect(() => {
        if (id && !category.single.loading && category.single.result) {
            setValue("category_code", category.single.result.category_code)
            setValue("category_name", category.single.result.category_name)
            setValue("description", category.single.result.description)
            setActive(category.single.result.active)
            setParentId(category.single.result.parent_id)
        }
    }, [id, category.single.loading, category.single.result])

    // ** Function handle
    const onSubmit = async (data: FormValuesCategory) => {
        if (id) {
            updateCategory({
                axiosClientJwt,
                category: {
                    category_code: data.category_code,
                    category_name: data.category_name,
                    description: data.description,
                    active,
                    ...parentId && { parent_id: parentId }
                },
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            createCategory({
                axiosClientJwt,
                category: {
                    category_code: data.category_code,
                    category_name: data.category_name,
                    description: data.description,
                    active,
                    ...parentId && { parent_id: parentId }
                },
                dispatch,
                message,
                navigate,
                setError
            })
        }
    };

    const dataParentCategory = (): ItemProps[] => {
        if (!id && !category.list.loading && category.list.result) {
            return category.list.result.categories.map((category) => {
                return {
                    label: category.category_name,
                    value: category.id
                }
            })
        }
        if (id && !category.list.loading && category.list.result) {
            return category.list.result.categories.filter((category) => category.id !== +id).map((item) => {
                return {
                    label: item.category_name,
                    value: item.id
                }
            })
        }
        return []
    }

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/catalog/categories'>Categories</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Update' : 'Create'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <Card>
                        <Form onFinish={handleSubmit(onSubmit)} layout="vertical" autoComplete="off">
                            <Col span={24}>
                                <Flex justifyContent="space-between" alignItems="center">
                                    <Flex justifyContent="center" alignItems="center">
                                        <Switch checked={active === 1} size='small' onChange={() => setActive(active === 1 ? 0 : 1)} />
                                        <Box as="span" ml={2} fontWeight="semibold">Active</Box>
                                    </Flex>
                                    {
                                        id && category.update.loading ?
                                            <Button type="primary" loading>Updating...</Button> :
                                            category.create.loading ?
                                                <Button type="primary" loading>Creating...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Update</Button> :
                                                    <Button htmlType="submit" type="primary">Create</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Form.Item label="Category name">
                                    <Controller
                                        name="category_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={categoryNameErrorRef}>
                                                    <Input {...field} placeholder="Eg: Shirt" />
                                                    {errors?.category_name ? <Box as="div" mt={1} textColor="red.600">{errors.category_name?.type === 'required' ? "Please input your category name!" : errors.category_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Category code">
                                    <Controller
                                        name="category_code"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={categoryCodeErrorRef}>
                                                    <Input {...field} placeholder="Eg: shirt" />
                                                    {errors?.category_code ? <Box as="div" mt={1} textColor="red.600">{errors.category_code?.type === 'required' ? "Please input your category code!" : errors.category_code.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Description">
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <div>
                                                    <Input.TextArea {...field} />
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Parent category">
                                    <Select
                                        loading={category.list.loading}
                                        value={parentId}
                                        onChange={(value: number) => setParentId(value)}
                                        options={[
                                            {
                                                label: "None",
                                                value: null
                                            },
                                            ...dataParentCategory()
                                        ]}
                                    />
                                </Form.Item>
                                {/* <Form.Item label="Products">
                                    <Select
                                        loading={category.list.loading}
                                        value={parentId}
                                        onChange={(value: number) => setParentId(value)}
                                        options={dataParentCategory()}
                                         onPopupScroll={(event) => {
                                            const target = event.target;
                                             // @ts-ignore: Unreachable code error
                                            if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
                                                
                                            }
                                        }}
                                    />
                                </Form.Item> */}
                            </Col>
                        </Form>
                        {id && <CategoriesChildren />}
                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}
export default CategoryCreateUpdate