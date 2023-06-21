// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import React, { Fragment } from 'react';
import { Input, InputNumber } from 'antd';
import { Controller } from "react-hook-form";
import { Text } from '@chakra-ui/react';

interface DataType {
    sku: JSX.Element;
    variant: JSX.Element;
    price: JSX.Element;
    stock: JSX.Element;
}

export const columns = () => [
    {
        title: 'Sku',
        dataIndex: 'sku',
        key: 'sku',
        render: (sku: JSX.Element,redcord) => sku
    },
    {
        title: 'Variant',
        dataIndex: 'variant',
        key: 'variant',
        render: (variant: JSX.Element) => variant
    },
    {
        title: 'Origin Price',
        dataIndex: 'originPrice',
        key: 'originPrice',
        render: (originPrice: JSX.Element) => originPrice
    },
    {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price: JSX.Element) => price
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        key: 'stock',
        render: (stock: JSX.Element) => stock
    },
];

export const data = ({ control, errors, variantItem, register }): DataType[] => {
    return variantItem.map((_item, index) => {
        return {
            sku: (
                <Controller
                    key={index}
                    name="sku"
                    {...register(`sku[${index}]`)}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, ...other } }) => {
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='sku'
                                    status={errors?.sku ? 'error' : ''}
                                    placeholder='Eg: bag-sku-01'

                                   disabled
                                    {...other}
                                    value={value || ''}
                                />
                            </Fragment>
                        )
                    }}
                />
            ),
            variant: (
                <Controller
                name="variant"
                {...register(`variant[${index}]`)}
                key={index}
                control={control}
                render={({field: {value}}) => {
                    return (
                        <Fragment>
                           <Text>{value}</Text>
                        </Fragment>
                    )
                }}
            />
            ),
            originPrice: (
                <Controller
                    name="originPrice"
                    key={index}
                    control={control}
                    {...register(`originPrice[${index}]`)}
                    // rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        console.log("value", value)
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='originPrice'
                                    disabled
                                    type=''
                                    defaultValue={0}
                                    {...other}
                                    value={value || 0}
                                />
                            </Fragment>
                        )
                    }}
                />
            ),
            price: (
                <Controller
                    name="price"
                    key={index}
                    control={control}
                    {...register(`price[${index}]`)}
                    // rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        console.log("value", value)
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='price'
                                    disabled
                                    type=''
                                    defaultValue={0}
                                    {...other}
                                    value={value || 0}
                                />
                            </Fragment>
                        )
                    }}
                />
            ),
            stock: (
                <Controller
                    name="stock"
                    key={index}
                    control={control}
                    {...register(`stock[${index}]`)}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    id='stock'
                                    defaultValue={0}
                                    disabled
                                    {...other}
                                    value={value || 0}
                                />
                            </Fragment>
                        )
                    }}
                />
            )
        }
    })
}
