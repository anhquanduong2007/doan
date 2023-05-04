// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// @ts-nocheck

import React, { Fragment } from 'react';
import { Input, InputNumber } from 'antd';
import { Controller } from "react-hook-form";

interface DataType {
    sku: JSX.Element;
    price: JSX.Element;
    stock: JSX.Element;
}

export const columns = () => [
    {
        title: 'Sku',
        dataIndex: 'sku',
        key: 'sku',
        render: (sku: JSX.Element) => sku
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

export const data = ({ control, errors, variantItem }): DataType[] => {

    return variantItem.map((_item, index) => {
        return {
            sku: (
                <Controller
                    key={index}
                    name="sku"
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
            price: (
                <Controller
                    name="price"
                    key={index}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <Input
                                    className='!my-1'
                                    id='price'
                                    type=''
                                    {...other}
                                    value={value || ''}
                                />
                            </Fragment>
                        )
                    }}
                />
            ),
            stock: (
                <Controller
                    name="sku"
                    key={index}
                    control={control}
                    render={({ field: { value, ...other } }) => {
                        return (
                            <Fragment>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    id='sku'
                                    {...other}
                                    value={value || ''}
                                />
                            </Fragment>
                        )
                    }}
                />
            )
        }
    })
}

