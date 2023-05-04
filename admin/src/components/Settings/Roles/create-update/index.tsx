import { Box, Flex } from '@chakra-ui/react';
import { Breadcrumb, Button, Card, Col, Divider, Input, Row, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createRole, getSingleRole, updateRole } from 'src/features/setting/role/actions';
import { createAxiosClient } from 'src/helper/axiosInstance';
import { ErrorValidateResponse } from 'src/types';

interface PermissionType {
    title: string
    description: string
    permissions: Array<string>
}

const permissions: PermissionType[] = [
    {
        title: "Product",
        description: "Grants permissions on Product",
        permissions: ["ReadProduct", "CreateProduct", "DeleteProduct", "UpdateProduct"]
    },
    {
        title: "Collection",
        description: "Grants permissions on Collection",
        permissions: ["ReadCollection", "CreateCollection", "DeleteCollection", "UpdateCollection"]
    },
    {
        title: "Asset",
        description: "Grants permissions on Asset",
        permissions: ["ReadAsset", "CreateAsset", "DeleteAsset", "UpdateAsset"]
    },
    {
        title: "Customer",
        description: "Grants permissions on Customer",
        permissions: ["ReadCustomer", "CreateCustomer", "DeleteCustomer", "UpdateCustomer"]
    },
    {
        title: "Promotion",
        description: "Grants permissions on Promotion",
        permissions: ["ReadPromotion", "CreatePromotion", "DeletePromotion", "UpdatePromotion"]
    },
    {
        title: "Administrator",
        description: "Grants permissions on Administrator",
        permissions: ["ReadAdministrator", "CreateAdministrator", "DeleteAdministrator", "UpdateAdministrator"]
    },
    {
        title: "Role",
        description: "Grants permissions on Role",
        permissions: ["ReadRole", "CreateRole", "DeleteRole", "UpdateRole"]
    },

]

interface FormValues  {
    description: string
    code: string,
}

const defaultValues: FormValues = {
    description: '',
    code: '',
    ...permissions.map((permission) => {
        return permission.permissions
    }).flat(1).reduce((prewPermiss, currentPermiss) => {
        return {
            ...prewPermiss,
            [currentPermiss]: false
        }
    }, {})
}
const RoleCreateUpdate = () => {
    // ** State
    const [isSubmited, setIsSubmited] = useState<boolean>(false)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({ defaultValues });

    // ** Variables
    const { id } = params
    const store = useAppSelector((state) => state.role);
    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    console.log(store)

    // ** Effect
    useEffect(() => {
        if (id) {
            getSingleRole({
                axiosClient,
                dispatch,
                id: +id
            })
        }
    }, [id])

    useEffect(() => {
        if (id && !store.single.loading && store.single.result) {
            setValue("code", store.single.result.code)
            setValue("description", store.single.result.description)
            store.single.result.permissions.forEach((permission) => {
                setValue(permission, true)
            })
        }
    }, [id, store.single.loading, store.single.result])

    useEffect(() => {
        // ** Create role
        if (!store.create.loading && isSubmited && !id && !store.create.error) {
            setIsSubmited(false)
            navigate('/settings/roles')
            message.success('Create role successfully!');
        }
        // ** Update role
        if (!store.update.loading && isSubmited && id && !store.update.error) {
            setIsSubmited(false)
            navigate('/settings/roles')
            message.success('Update role successfully!');
        }
        // ** Error when create role
        if (!store.create.loading && isSubmited && !id && store.create.error) {
            const error = { ...store.create.result } as ErrorValidateResponse
            setError(error.fieldError, { message: error.message })
        }
        // ** Error when update role
        if (!store.update.loading && isSubmited && id && store.update.error) {
            const error = { ...store.update.result } as ErrorValidateResponse
            setError(error.fieldError, { message: error.message })
        }
    }, [
        store.create.loading,
        store.create.error,
        store.update.loading,
        store.update.error,
        isSubmited,
        id,
    ])

    // ** Function handle
    const onSubmit = (data: any) => {
        const permissions = Object.keys(data).filter(key => data[key] === true)
        if (id) {
            updateRole({
                axiosClient,
                dispatch,
                id: +id,
                role: {
                    code: data.code,
                    permissions,
                    description: data.description
                }
            })
        } else {
            createRole({
                axiosClient,
                dispatch,
                role: {
                    code: data.code,
                    permissions,
                    description: data.description
                }
            })
        }
        setIsSubmited(true)
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
                            <Link to='/settings/roles'>Roles</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Update' : 'Create'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col span={24}>
                                <Flex justifyContent="flex-end" alignItems="center">
                                    {
                                        id && store.update.loading ?
                                            <Button type="primary" loading>Updating...</Button> :
                                            store.create.loading ?
                                                <Button type="primary" loading>Creating...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Update</Button> :
                                                    <Button htmlType="submit" type="primary">Create</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Card>
                                    <Box mb={4}>
                                        <Box as="label" htmlFor='description' mr={2} cursor="pointer" fontWeight="bold">Description</Box>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <Box mt={1}>
                                                        <Input
                                                            id='description'
                                                            value={value || ''}
                                                            {...other}
                                                            placeholder='Description'
                                                        />
                                                    </Box>
                                                )
                                            }}
                                        />
                                    </Box>
                                    <Box mb={4}>
                                        <Box as="label" mr={2} cursor="pointer" fontWeight="bold" htmlFor='code'>Code</Box>
                                        <Controller
                                            name="code"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <Box mt={1}>
                                                        <Input
                                                            id='code'
                                                            status={errors?.code ? 'error' : ''}
                                                            value={value || ''}
                                                            {...other}
                                                            placeholder='Code'
                                                        />
                                                        {errors?.code ? <Box as="p" mt={1} textColor="red.600">{errors.code?.type === 'required' ? "This field is required!" : errors.code.message}</Box> : null}
                                                    </Box>
                                                )
                                            }}
                                        />
                                    </Box>
                                    <div>
                                        <Box mb={4} fontWeight="bold">Permissions</Box>
                                        {permissions.map((permission, index: number) => {
                                            return (
                                                <Row key={index}>
                                                    <Col span={6} style={{ background: "#f2f3f5", padding: "16px", borderBottom: "1px solid #bfc3cc" }}>
                                                        <Flex flexDirection="column">
                                                            <Box fontWeight="bold" textColor="#666">{permission.title}</Box>
                                                            <Box textColor="#666" fontSize="12px">{permission.description}</Box>
                                                        </Flex>
                                                    </Col>
                                                    <Col span={18}
                                                        style={index === 0 ?
                                                            { padding: "16px", border: "1px solid #f2f3f5", borderRight: "unset" } :
                                                            { padding: "16px", border: "1px solid #f2f3f5", borderRight: "unset", borderTop: "unset" }}
                                                    >
                                                        <Flex justifyContent="space-around" alignItems="center" height="100%">
                                                            {permission.permissions.map((item, index: number) => {
                                                                return (
                                                                    <Flex justifyContent="center" alignItems="center" key={index}>
                                                                        <Controller
                                                                            name={item}
                                                                            control={control}
                                                                            render={({ field: { value, ...other } }) => {
                                                                                return (
                                                                                    <Fragment>
                                                                                        <Input
                                                                                            id={item}
                                                                                            type='checkbox'
                                                                                            checked={value || false}
                                                                                            value={value || false}
                                                                                            {...other}
                                                                                            placeholder='Code'
                                                                                        />
                                                                                    </Fragment>
                                                                                )
                                                                            }}
                                                                        />
                                                                        <Box as="label" ml={2} cursor="pointer" fontWeight="semibold" htmlFor={item}>{item}</Box>
                                                                    </Flex>
                                                                )
                                                            })}
                                                        </Flex>
                                                    </Col>
                                                </Row>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </form>
                </Col>
            </Row>
        </Fragment>
    );
};

export default RoleCreateUpdate;