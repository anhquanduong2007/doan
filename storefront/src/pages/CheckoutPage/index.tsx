import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Col, Form, Input, Button, Modal } from 'antd';
import Layout from 'src/components/Layout/layout';
import { Box, BreadcrumbItem, Card, HStack, useToast, Breadcrumb, Flex } from '@chakra-ui/react';
import { Divider } from 'antd'
import Icon1 from '../../assets/icon-footer/icon-pay-01.png'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import autoAnimate from '@formkit/auto-animate';
import { checkPromotion, createOrder, createOrderByPayment, resetPromotionAction } from 'src/features/checkout/action';
import { createAxiosClient, createAxiosJwt } from 'src/axios/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getCart, updateCart } from 'src/features/cart/action';
import formatMoney from 'src/shared/utils/formatMoney';
import Address from 'src/components/Checkout/Address';
import { UserAddress } from 'src/shared/types';
import { ChevronRight } from 'react-feather';
import { resetPromotion } from 'src/features/checkout/checkoutSlice';
import CouponModal from 'src/components/Checkout/CouponModal';

export enum PaymentMethod {
    Standard = "Standard",
    Card = "Card"
}

interface FormValues {
    coupon_code: string
    quantity: number
}

const CheckoutPage = () => {
    // ** State
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Standard)
    const [refresh, setRefresh] = useState<boolean>(false)
    const [address, setAddress] = useState<UserAddress>()
    const [couponModal, setCouponModal] = useState<boolean>(false)

    // ** Variables
    const axiosClient = createAxiosClient();
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();
    const checkout = useAppSelector((state) => state.checkout);
    const cart = useAppSelector((state) => state.cart)

    // ** Third party
    const navigate = useNavigate()
    const params = useParams()
    const toast = useToast()
    const { id } = params
    const { control, handleSubmit, setValue, setError, formState: { errors }, resetField } = useForm<FormValues>({
        defaultValues: {
            coupon_code: '',
            quantity: 1
        }
    });

    // ** Ref
    const couponCodeErrorRef = useRef(null);

    // ** Effect
    useEffect(() => {
        couponCodeErrorRef.current && autoAnimate(couponCodeErrorRef.current);
    }, [parent])

    useEffect(() => {
        if (!checkout.promotion.loading && checkout.promotion.result) {
            setValue('coupon_code', checkout.promotion.result.coupon_code)
        }
        if (!cart.cart.loading && cart.cart.result) {
            setValue('quantity', cart.cart.result.quantity)
        }
    }, [
        checkout.promotion.loading,
        checkout.promotion.result,
        cart.cart.loading,
        cart.cart.result
    ])

    useEffect(() => {
        if (id) {
            getCart({
                axiosClientJwt,
                dispatch,
                id: +id,
                toast
            })
        }
    }, [id, refresh])

    // ** Funtion handle
    const onApplyPromotion = (data: FormValues) => {
        checkPromotion({
            axiosClient,
            coupon_code: data.coupon_code,
            dispatch,
            refresh,
            setError,
            setRefresh,
            toast
        })
    }


    return (
        <Fragment>
            <div className='py-8 px-10 mt-16'>
                <Row>
                    <Col>
                        <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
                            <BreadcrumbItem>
                                <Link to='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage>
                                <Link to='/#' className='!text-[#999] text-sm font-medium'>Checkout</Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16, 0]}>
                            <Col span={18}>
                                {/* Item */}
                                <div className='mb-[1rem]'>
                                    <Card variant="outline" padding={8}>
                                        <div className='text-center font-bold'>Item</div>
                                        <Divider />
                                        <Row gutter={[16, 0]}>
                                            <Col span={6}>
                                                <img
                                                    alt=''
                                                    src={!cart.cart.loading && cart.cart.result ?
                                                        cart.cart.result.product_variant?.featured_asset ?
                                                            cart.cart.result.product_variant.featured_asset.url :
                                                            'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png' :
                                                        'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png'}
                                                    className='w-full object-cover p-2 rounded-lg'
                                                />
                                            </Col>
                                            <Col span={18}>
                                                <div className='text-2xl font-bold mb-1'>{!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.name : ''}</div>
                                                <div className='text-[#808080] mb-1'>{!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.sku : ''}</div>
                                                <div className='mb-1'>Stock: {!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.stock : ''}</div>
                                                <Form>
                                                    <Controller
                                                        name='quantity'
                                                        control={control}
                                                        render={({ field: { value, ...other } }) => (
                                                            <Fragment>
                                                                <HStack maxW='320px'>
                                                                    <Button
                                                                        loading={cart.update.loading}
                                                                        onClick={() => {
                                                                            resetField('quantity')
                                                                            updateCart({
                                                                                axiosClientJwt,
                                                                                cart: {
                                                                                    quantity: value - 1
                                                                                },
                                                                                dispatch,
                                                                                id: !cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.id : 0,
                                                                                refresh,
                                                                                setError,
                                                                                setRefresh,
                                                                                toast
                                                                            })
                                                                        }}
                                                                    >
                                                                        -
                                                                    </Button>
                                                                    <Input type="number" width={'30px'} {...other} value={value} disabled={cart.update.loading} />
                                                                    <Button
                                                                        loading={cart.update.loading}
                                                                        onClick={() => {
                                                                            resetField('quantity')
                                                                            updateCart({
                                                                                axiosClientJwt,
                                                                                cart: {
                                                                                    quantity: value + 1
                                                                                },
                                                                                dispatch,
                                                                                id: !cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.id : 0,
                                                                                refresh,
                                                                                setError,
                                                                                setRefresh,
                                                                                toast
                                                                            })
                                                                        }}
                                                                    >
                                                                        +
                                                                    </Button>
                                                                </HStack>
                                                                {errors?.quantity ? <Box as="div" mt={1} textColor="red.600">{errors.quantity.message}</Box> : null}
                                                            </Fragment>
                                                        )}
                                                    />
                                                </Form>
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                                {/* Address */}
                                <Address address={address as UserAddress} setAddress={setAddress} />
                                {/* Coupon */}
                                <div className='mb-[1rem]'>
                                    <Card variant="outline" padding={8} >
                                        <Flex justifyContent="flex-end">
                                            <Button onClick={() => setCouponModal(true)}>See available coupons</Button>
                                        </Flex>
                                        <div className='text-center font-bold'>Coupon code</div>
                                        <Divider />
                                        <Form className='flex'>
                                            <Controller
                                                name="coupon_code"
                                                control={control}
                                                render={({ field }) => {
                                                    return (
                                                        <div ref={couponCodeErrorRef} className='flex-1'>
                                                            <Input {...field} />
                                                            {errors?.coupon_code ? <Box as="div" mt={1} textColor="red.600">{errors.coupon_code.message}</Box> : null}
                                                        </div>
                                                    )
                                                }}
                                            />
                                            <Button
                                                className='ml-2'
                                                type='primary'
                                                onClick={handleSubmit(onApplyPromotion)}
                                                disabled={!checkout.promotion.loading && checkout.promotion.result ? true : false}
                                                loading={checkout.promotion.loading}
                                            >
                                                Apply
                                            </Button>
                                            {
                                                !checkout.promotion.loading && checkout.promotion.result ? (
                                                    <Button
                                                        className='ml-2'
                                                        type='primary'
                                                        danger
                                                        onClick={() => {
                                                            setValue("coupon_code", '')
                                                            resetPromotionAction({
                                                                dispatch,
                                                                refresh,
                                                                setRefresh
                                                            })
                                                        }}
                                                    >
                                                        Cancel application
                                                    </Button>
                                                ) : null
                                            }
                                        </Form>
                                    </Card>
                                </div>
                                {/* Payment method */}
                                <div className='mb-[1rem]'>
                                    <Card variant="outline" padding={8}>
                                        <div className='text-center font-bold'>Payment methods</div>
                                        <Divider />
                                        <Row gutter={[12, 12]}>
                                            <Col span={12} >
                                                <Card
                                                    variant={paymentMethod === PaymentMethod.Standard ? "filled" : "outline"}
                                                    p={2} h="100%"
                                                    className='cursor-pointer flex justify-center items-center'
                                                    onClick={() => { setPaymentMethod(PaymentMethod.Standard) }}
                                                >
                                                    <span className='text-center font-semibold'>Payment on delivery</span>
                                                </Card>
                                            </Col>
                                            <Col span={12}>
                                                <Card
                                                    variant={paymentMethod === PaymentMethod.Card ? "filled" : "outline"}
                                                    p={2}
                                                    h="100%"
                                                    className='cursor-pointer flex justify-center items-center'
                                                    onClick={() => { setPaymentMethod(PaymentMethod.Card) }}
                                                >
                                                    <p className='text-center font-semibold'>Payment by Paypal</p>
                                                    <div className='flex flex-row justify-center mb-3'>
                                                        <img src={Icon1} alt="" />
                                                    </div>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>
                                </div>
                            </Col>
                            <Col span={6}>
                                <Card padding={8} variant="outline">
                                    <div className='text-center font-bold'>Order</div>
                                    <Divider />
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='font-semibold'>Price</span>
                                        <span className='font-bold'>{formatMoney(!cart.cart.loading && cart.cart.result ? cart.cart.result.product_variant.price : 0)}</span>
                                    </div>
                                    <div className='flex justify-between items-center mb-1'>
                                        <span className='font-semibold'>Quantity</span>
                                        <span className='font-bold'>x{!cart.cart.loading && cart.cart.result ? cart.cart.result.quantity : 0}</span>
                                    </div>
                                    {
                                        !checkout.promotion.loading && checkout.promotion.result ? (
                                            <div className='flex justify-between items-center mb-1'>
                                                <span className='font-semibold'>Coupon</span>
                                                <span className='font-bold'>{checkout.promotion.result.discount}%</span>
                                            </div>
                                        ) : null
                                    }
                                    <div className='flex justify-between items-center mb-4'>
                                        <span className='font-semibold'>Total</span>
                                        <span className='font-bold'>
                                            {formatMoney(!cart.cart.loading && cart.cart.result ? !checkout.promotion.loading && checkout.promotion.result ? cart.cart.result.product_variant.price * cart.cart.result.quantity * ((100 - checkout.promotion.result.discount) / 100) : cart.cart.result.product_variant.price * cart.cart.result.quantity : 0)}
                                        </span>
                                    </div>
                                    {
                                        !cart.cart.loading && cart.cart.result && cart.cart.result.quantity && cart.cart.result.product_variant.id && address && paymentMethod ? (
                                            <div>
                                                <Button
                                                    className='w-full'
                                                    type='primary'
                                                    loading={paymentMethod === PaymentMethod.Standard ? checkout.createOrder.loading : false}
                                                    onClick={() => {
                                                        if (paymentMethod === PaymentMethod.Standard) {
                                                            createOrder({
                                                                axiosClientJwt,
                                                                dispatch,
                                                                navigate,
                                                                order: {
                                                                    address_id: address.id,
                                                                    payment_method: paymentMethod,
                                                                    product_variant_id: cart.cart.result?.product_variant.id as number,
                                                                    quantity: cart.cart.result?.quantity as number,
                                                                    ...checkout.promotion.result && { promotion_id: checkout.promotion.result.id }
                                                                },
                                                                toast
                                                            })
                                                        } else {
                                                            createOrderByPayment(axiosClientJwt, {
                                                                address_id: address.id,
                                                                payment_method: paymentMethod,
                                                                product_variant_id: cart.cart.result?.product_variant.id as number,
                                                                quantity: cart.cart.result?.quantity as number,
                                                                ...checkout.promotion.result && { promotion_id: checkout.promotion.result.id }
                                                            }).then((data: any) => {
                                                                window.location.replace(data?.paymentUrl);
                                                                dispatch(resetPromotion())
                                                            })
                                                        }
                                                    }}
                                                >
                                                    Pay
                                                </Button>
                                            </div>) : null
                                    }
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <CouponModal couponModal = {couponModal} setCouponModal = {setCouponModal}/>
        </Fragment>
    );
};

export default CheckoutPage;