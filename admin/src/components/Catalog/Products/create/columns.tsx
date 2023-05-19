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
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='sku'
                                    status={errors?.sku ? 'error' : ''}
                                    placeholder='Eg: bag-sku-01'
                                    {...other}
                                    value={value || ''}
                                />
                                {errors?.sku ? <span className="text-red-500">{errors.sku?.type === 'required' ? "Sku is required!" : errors.sku.message}</span> : null}
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
                render={({field: {value:{name}}}) => {
                    return (
                        <Fragment>
                           <Text>{name}</Text>
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
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='price'
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

