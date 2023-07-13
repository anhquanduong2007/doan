import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate';
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, Row, Spin, message } from 'antd';
import React, { Fragment, useEffect, useRef } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createRole, getSingleRole, updateRole } from 'src/features/setting/role/actions';
import { createAxiosJwt } from 'src/helper/axiosInstance';

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
        title: "Category",
        description: "Grants permissions on Category",
        permissions: ["ReadCategory", "CreateCategory", "DeleteCategory", "UpdateCategory"]
    },
    {
        title: "Asset",
        description: "Grants permissions on Asset",
        permissions: ["ReadAsset", "CreateAsset", "DeleteAsset"]
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

export interface FormValuesRole {
    role_name: string
    role_code: string,
    description: string
}

const defaultValues: FormValuesRole = {
    description: '',
    role_code: '',
    role_name: '',
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
    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({ defaultValues });

    // ** Variables
    const { id } = params
    const role = useAppSelector((state) => state.role);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();


    // ** Ref
    const roleNameErrorRef = useRef(null);
    const roleCodeErrorRef = useRef(null);

    // ** Effect
    useEffect(() => {
        roleNameErrorRef.current && autoAnimate(roleNameErrorRef.current);
        roleCodeErrorRef.current && autoAnimate(roleCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getSingleRole({
                axiosClientJwt,
                navigate,
                dispatch,
                id: +id
            })
        }
    }, [id])

    useEffect(() => {
        const perms = permissions.map((permission) => {
            return permission.permissions
        }).flat(1).reduce((prewPermiss, currentPermiss) => {
            return {
                ...prewPermiss,
                [currentPermiss]: false
            }
        }, {})
        Object.keys(perms).forEach((key) => {
            // @ts-ignore: Unreachable code error
            setValue(key, false)
        })
        if (id && !role.single.loading && role.single.result) {
            setValue("role_name", role.single.result.role_name)
            setValue("role_code", role.single.result.role_code)
            setValue("description", role.single.result.description)
            role.single.result.permissions.forEach((permission) => {
                // @ts-ignore: Unreachable code error
                setValue(permission, true)
            })
        }
    }, [id, role.single.loading, role.single.result])

    // ** Function handle
    const onSubmit = (data: FormValuesRole) => {
        // @ts-ignore: Unreachable code error
        const permissions = Object.keys(data).filter(key => data[key] === true)
        if (id) {
            updateRole({
                axiosClientJwt,
                dispatch,
                message,
                navigate,
                setError,
                id: +id,
                role: {
                    role_code: data.role_code,
                    role_name: data.role_name,
                    permissions,
                    description: data.description
                }
            })
        } else {
            createRole({
                axiosClientJwt,
                dispatch,
                role: {
                    role_code: data.role_code,
                    role_name: data.role_name,
                    permissions,
                    description: data.description
                },
                message,
                navigate,
                setError
            })
        }
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
                    <Spin spinning={role.single.loading}>
                        <Form onFinish={handleSubmit(onSubmit)} layout='vertical'>
                            <Row>
                                <Col span={24}>
                                    <Flex justifyContent="flex-end" alignItems="center">
                                        {
                                            id && role.update.loading ?
                                                <Button type="primary" loading>Updating...</Button> :
                                                role.create.loading ?
                                                    <Button type="primary" loading>Creating...</Button> :
                                                    id ? <Button htmlType="submit" type="primary">Update</Button> :
                                                        <Button htmlType="submit" type="primary">Create</Button>
                                        }
                                    </Flex>
                                </Col>
                                <Divider />
                                <Col span={24}>
                                    <Card>
                                        <Form.Item label="Role name">
                                            <Controller
                                                name="role_name"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => {
                                                    return (
                                                        <div ref={roleNameErrorRef}>
                                                            <Input {...field} placeholder="Eg: superadmin" />
                                                            {errors?.role_name ? <Box as="div" mt={1} textColor="red.600">{errors.role_name?.type === 'required' ? "Please input your role name!" : errors.role_name.message}</Box> : null}
                                                        </div>
                                                    )
                                                }}
                                            />
                                        </Form.Item>
                                        <Form.Item label="Role code">
                                            <Controller
                                                name="role_code"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => {
                                                    return (
                                                        <div ref={roleCodeErrorRef}>
                                                            <Input {...field} placeholder="Eg: superadmin" />
                                                            {errors?.role_code ? <Box as="div" mt={1} textColor="red.600">{errors.role_code?.type === 'required' ? "Please input your role code!" : errors.role_code.message}</Box> : null}
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
                                        <Form.Item label="Permissions">
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
                                                                {permission.permissions.map((item: any, index: number) => {
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
                                        </Form.Item>
                                    </Card>
                                </Col>
                            </Row>
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </Fragment>
    );
};

export default RoleCreateUpdate;