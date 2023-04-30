import { Breadcrumb, Button, Card, Col, Divider, Input, Row, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createRole } from 'src/features/setting/role/actions';
import { createAxiosClient } from 'src/helper/axiosInstance';

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

interface DefaultValuesType {
    description: string
    code: string,
    SuperAdmin: boolean
    ReadProduct: boolean
    DeleteProduct: boolean
    UpdateProduct: boolean
    CreateProduct: boolean
    ReadCollection: boolean
    CreateCollection: boolean
    DeleteCollection: boolean
    UpdateCollection: boolean
    ReadAsset: boolean
    CreateAsset: boolean
    DeleteAsset: boolean
    UpdateAsset: boolean
    ReadCustomer: boolean
    CreateCustomer: boolean
    DeleteCustomer: boolean
    UpdateCustomer: boolean
    ReadPromotion: boolean
    CreatePromotion: boolean
    DeletePromotion: boolean
    UpdatePromotion: boolean
    ReadAdministrator: boolean
    CreateAdministrator: boolean
    DeleteAdministrator: boolean
    UpdateAdministrator: boolean
    ReadRole: boolean
    CreateRole: boolean
    DeleteRole: boolean
    UpdateRole: boolean
}

const defaultValues: DefaultValuesType = {
    description: '',
    code: '',
    SuperAdmin: false,
    ReadProduct: false,
    DeleteProduct: false,
    UpdateProduct: false,
    CreateProduct: false,
    ReadCollection: false,
    CreateCollection: false,
    DeleteCollection: false,
    UpdateCollection: false,
    ReadAsset: false,
    CreateAsset: false,
    DeleteAsset: false,
    UpdateAsset: false,
    ReadCustomer: false,
    CreateCustomer: false,
    DeleteCustomer: false,
    UpdateCustomer: false,
    ReadPromotion: false,
    CreatePromotion: false,
    DeletePromotion: false,
    UpdatePromotion: false,
    ReadAdministrator: false,
    CreateAdministrator: false,
    DeleteAdministrator: false,
    UpdateAdministrator: false,
    ReadRole: false,
    CreateRole: false,
    DeleteRole: false,
    UpdateRole: false,
}
const RoleCreateUpdate = () => {
    // ** State
    const [isSubmited, setIsSubmited] = useState<boolean>(false)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { control, handleSubmit, formState: { errors } } = useForm<DefaultValuesType>({ defaultValues });

    // ** Variables
    const { id } = params
    const store = useAppSelector((state) => state.role);
    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    console.log(store)

    // ** Effect
    useEffect(() => {
        // ** Create role
        if (!store.create.loading && isSubmited && !id && !store.create.error) {
            setIsSubmited(false)
            navigate('/roles')
            message.success('Create role successfully!');
        }
    }, [store.create.loading, isSubmited, id, store.create.error])

    // ** Function handle
    const onSubmit = (data: any) => {
        const permissions = Object.keys(data).filter(key => data[key] === true)
        if (id) {

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
                            <Link to='/roles'>Roles</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{id ? 'Update' : 'Create'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col span={24}>
                                <div className='flex justify-end items-center'>
                                    {
                                        id && store.update.loading ?
                                            <Button type="primary" loading>Updating...</Button> :
                                            store.create.loading ?
                                                <Button type="primary" loading>Creating...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Update</Button> :
                                                    <Button htmlType="submit" type="primary">Create</Button>
                                    }
                                </div>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Card>
                                    <div className='mb-4'>
                                        <label className='mr-2 cursor-pointer font-semibold' htmlFor='description'>Description</label>
                                        <Controller
                                            name="description"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <Fragment>
                                                        <Input
                                                            id='description'
                                                            value={value || ''}
                                                            {...other}
                                                            status={errors?.description ? 'error' : ''}
                                                            placeholder='Description'
                                                            className='!mt-1'
                                                        />
                                                        {errors?.description ? <p className='mt-1 text-red-600'>{errors.description?.type === 'required' ? "This field is required!" : errors.description.message}</p> : null}
                                                    </Fragment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className='mb-4'>
                                        <label className='mr-2 cursor-pointer font-semibold' htmlFor='code'>Code</label>
                                        <Controller
                                            name="code"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, ...other } }) => {
                                                return (
                                                    <Fragment>
                                                        <Input
                                                            id='code'
                                                            status={errors?.code ? 'error' : ''}
                                                            value={value || ''}
                                                            {...other}
                                                            className='!mt-1'
                                                            placeholder='Code'
                                                        />
                                                        {errors?.code ? <p className='mt-1 text-red-600'>{errors.code?.type === 'required' ? "This field is required!" : errors.code.message}</p> : null}
                                                    </Fragment>
                                                )
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className='mb-4'>Permissions</div>
                                        {permissions.map((permission, index: number) => {
                                            return (
                                                <Row key={index}>
                                                    <Col span={6} className='bg-[#f2f3f5] border-b  border-[#bfc3cc] p-4'>
                                                        <div className='flex flex-col'>
                                                            <span className='font-bold text-[#666]'>{permission.title}</span>
                                                            <span className='text-[12px] text-[#666]'>{permission.description}</span>
                                                        </div>
                                                    </Col>
                                                    <Col span={18} className={index === 0 ? 'border-b border-l border-t  border-[#f2f3f5] p-4' : 'border-b border-l  border-[#f2f3f5] p-4'}>
                                                        <div className='flex justify-around items-center h-full'>
                                                            {permission.permissions.map((item, index: number) => {
                                                                return (
                                                                    <div className='flex justify-center items-center' key={index}>
                                                                        <Controller
                                                                            name={item as any}
                                                                            control={control}
                                                                            render={({ field: { value, ...other } }) => {
                                                                                return (
                                                                                    <Fragment>
                                                                                        <Input
                                                                                            id={item}
                                                                                            type='checkbox'
                                                                                            value={value || false}
                                                                                            {...other}
                                                                                            className='!mr-2 focus:!shadow-none'
                                                                                            placeholder='Code'
                                                                                        />
                                                                                    </Fragment>
                                                                                )
                                                                            }}
                                                                        />
                                                                        <label className='mr-2 cursor-pointer font-semibold' htmlFor={item}>{item}</label>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
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