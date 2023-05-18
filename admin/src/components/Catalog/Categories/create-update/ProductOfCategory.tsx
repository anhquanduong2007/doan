import { Avatar, Button, Space, Table, Tag } from 'antd';
import React from 'react';
import { Product } from 'src/types';
import type { ColumnsType } from "antd/es/table";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

interface ProductOfCategoryProps {
    products: Product[],
    loading: boolean
}

interface DataType {
    key: number
    id: number
    name: string;
    url: string
    active: number
}

const columns = (
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Product name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => {
                return (
                    <Flex alignItems={"center"}>
                        <Avatar src={<img src={record.url} style={{ width: 40 }} />} />
                        <Box ml={2}>{name}</Box>
                    </Flex>
                )
            }
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            render: (active: number) => {
                return (
                    <Tag color={active === 1 ? 'green' : 'gold'}>{active === 1 ? 'Active' : 'Disabled'}</Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button onClick={() => { navigate(`/catalog/products/detail-update/${record.id}`) }}>Open</Button>
                    </Space>
                )
            },
        },
    ]

const ProductOfCategory = ({ products, loading }: ProductOfCategoryProps) => {
    // ** Third party
    const navigate = useNavigate()

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!loading && products) {
            return products.map((product, index: number) => {
                return {
                    key: index,
                    id: product.id,
                    name: product.name,
                    url: product?.featured_asset?.url,
                    active: product.active
                }
            })
        }
        return []
    }

    return (
        <Table bordered columns={columns(navigate)} dataSource={dataRender()} loading={loading} />

    );
};

export default ProductOfCategory;