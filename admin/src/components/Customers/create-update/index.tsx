import { Box, Flex } from "@chakra-ui/react"
import autoAnimate from "@formkit/auto-animate"
import { Breadcrumb, Button, Card, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Switch, message } from "antd"
import { Fragment, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "src/app/hooks"
import { createAxiosJwt } from "src/helper/axiosInstance"
import type { DatePickerProps } from 'antd';
import moment from 'moment';
import { createCustomer, getCustomer, updateCustomer } from "src/features/customer/action"
import {
    PlusCircleOutlined
} from '@ant-design/icons';
import Address from "./Address"
import AddressModal from "./AddressModal"

export type FormValuesCustomer = {
    email: string
    first_name: string
    last_name: string
    password: string
    phone: string
};

const dateFormat = 'YYYY/MM/DD';

const CustomerCreateUpdate = () => {
    // ** State
    const [active, setActive] = useState<number>(1)
    const [gender, setGender] = useState<number>(0)
    const [dateOfBirth, setDateOfBirth] = useState<string>()
    const [addressModal, setAddressModal] = useState<boolean>(false)
    const [mode, setMode] = useState<boolean>(false)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [updateAddress, setUpdateAddress] = useState<number>()

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormValuesCustomer>({
        defaultValues: {
            email: '',
            first_name: '',
            password: '',
            last_name: '',
            phone: '',
        }
    });


    // ** Variables
    const customer = useAppSelector((state) => state.customer);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Ref
    const firstNameErrorRef = useRef(null);
    const lastNameErrorRef = useRef(null);
    const emailErrorRef = useRef(null);
    const passwordErrorRef = useRef(null);

    // ** Effect
    useEffect(() => {
        firstNameErrorRef.current && autoAnimate(firstNameErrorRef.current);
        lastNameErrorRef.current && autoAnimate(lastNameErrorRef.current);
        emailErrorRef.current && autoAnimate(emailErrorRef.current);
        passwordErrorRef.current && autoAnimate(passwordErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (id) {
            getCustomer({
                axiosClientJwt,
                dispatch,
                id: +id,
                navigate
            })
        }
    }, [id, refresh])

    useEffect(() => {
        if (id && !customer.single.loading && customer.single.result) {
            setValue("email", customer.single.result.email)
            setValue("first_name", customer.single.result.first_name)
            setValue("last_name", customer.single.result.last_name)
            setValue("phone", customer.single.result.phone)
            setActive(customer.single.result.active)
            setDateOfBirth(customer.single.result.date_of_birth)
            setGender(customer.single.result.gender)
        }
    }, [id, customer.single.loading, customer.single.result])

    // ** Function handle
    const onChangeDatePicker: DatePickerProps['onChange'] = (date, _dateString) => {
        setDateOfBirth(date?.toISOString() as string)
    };

    const handleChangeGender = (value: number) => {
        setGender(value)
    };

    const onSubmit = async (data: FormValuesCustomer) => {
        if (id) {
            await updateCustomer({
                customer: {
                    active,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    date_of_birth: dateOfBirth,
                    gender,
                    phone: data.phone,
                },
                axiosClientJwt,
                dispatch,
                id: +id,
                message,
                navigate,
                setError
            })
        } else {
            await createCustomer({
                customer: {
                    active,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    password: data.password,
                    date_of_birth: dateOfBirth,
                    gender,
                    phone: data.phone
                },
                axiosClientJwt,
                dispatch,
                navigate,
                setError,
                message
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
                            <Link to='/customers'>Customers</Link>
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
                                        id && customer.update.loading ?
                                            <Button type="primary" loading>Updating...</Button> :
                                            customer.create.loading ?
                                                <Button type="primary" loading>Creating...</Button> :
                                                id ? <Button htmlType="submit" type="primary">Update</Button> :
                                                    <Button htmlType="submit" type="primary">Create</Button>
                                    }
                                </Flex>
                            </Col>
                            <Divider />
                            <Col span={24}>
                                <Form.Item label="First name">
                                    <Controller
                                        name="first_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={firstNameErrorRef}>
                                                    <Input {...field} placeholder="Eg: Quan" />
                                                    {errors?.first_name ? <Box as="div" mt={1} textColor="red.600">{errors.first_name?.type === 'required' ? "Please input your first name!" : errors.first_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Last name">
                                    <Controller
                                        name="last_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={lastNameErrorRef}>
                                                    <Input {...field} placeholder="Eg: Duong" />
                                                    {errors?.last_name ? <Box as="div" mt={1} textColor="red.600">{errors.last_name?.type === 'required' ? "Please input your last name!" : errors.last_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Email">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={lastNameErrorRef}>
                                                    <Input type="email" {...field} placeholder="Eg: qunduong2007@gmail.com" />
                                                    {errors?.email ? <Box as="div" mt={1} textColor="red.600">{errors.email?.type === 'required' ? "Please input your email!" : errors.email.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                {
                                    !id && (
                                        <Form.Item label="password">
                                            <Controller
                                                name="password"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => {
                                                    return (
                                                        <div ref={lastNameErrorRef}>
                                                            <Input.Password {...field} />
                                                            {errors?.password ? <Box as="div" mt={1} textColor="red.600">{errors.password?.type === 'required' ? "Please input your password!" : errors.password.message}</Box> : null}
                                                        </div>
                                                    )
                                                }}
                                            />
                                        </Form.Item>
                                    )
                                }
                                <Form.Item label="Phone">
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <div>
                                                    <Input {...field} />
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Date of birth">
                                    <DatePicker value={dateOfBirth ? moment(dateOfBirth?.substring(0, 10), dateFormat) : '' as any} onChange={onChangeDatePicker} />
                                </Form.Item >
                                <Form.Item label="Gender">
                                    <Select
                                        defaultValue={gender}
                                        onChange={handleChangeGender}
                                        options={[
                                            {
                                                value: 0,
                                                label: 'None',
                                            },
                                            {
                                                value: 1,
                                                label: "Male",
                                            },
                                            {
                                                value: 2,
                                                label: 'Female',
                                            },

                                        ]}
                                    />
                                </Form.Item>
                                {
                                    id && (
                                        <Form.Item>
                                            <Button style={{ textTransform: "uppercase" }} type="primary" icon={<PlusCircleOutlined />} onClick={() => {
                                                setAddressModal(true)
                                                setMode(false)
                                            }}>Create new address</Button>
                                        </Form.Item>
                                    )
                                }
                                {
                                    id && (
                                        <Form.Item>
                                            <Row gutter={[12, 12]}>
                                                {
                                                    !customer.single.loading && customer.single.result && (
                                                        customer.single.result.address.map((address, index) => {
                                                            return (
                                                                <Col span={8} style={{ display: "flex" }} key={index}>
                                                                    <Address
                                                                        address={address}
                                                                        setRefresh={setRefresh}
                                                                        refresh={refresh}
                                                                        setUpdateAddress={setUpdateAddress}
                                                                        setMode={setMode}
                                                                        setAddressModal={setAddressModal}
                                                                    />
                                                                </Col>
                                                            )
                                                        })
                                                    )
                                                }
                                            </Row>
                                        </Form.Item>
                                    )
                                }
                            </Col>
                        </Form>
                    </Card>
                </Col>
            </Row>
            {id && (<AddressModal
                addressModal={addressModal}
                setAddressModal={setAddressModal}
                mode={mode}
                updateAddress={updateAddress as number}
                refresh={refresh}
                setRefresh={setRefresh}
            />)}
        </Fragment>
    )
}

export default CustomerCreateUpdate