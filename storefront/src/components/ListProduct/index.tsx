import React, { Fragment, useState } from 'react'
import { createAxiosClient } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product } from 'src/shared/types';
import { Row, Col, Pagination, Input } from 'antd'
import CardProduct from '../CardProduct/cardProduct';
import { Flex } from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';

interface ProductList {
    products: Product[]
    totalPage: number
    total: number
    skip: number
    take: number
}

interface ListProductProps {
    filterCategories: number[],
    price: number
}

const ListProduct = ({ filterCategories, price }: ListProductProps) => {
    // ** State
    const [products, setProducts] = React.useState<ProductList>()
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [value] = useDebounce(search, 1000);

    // ** Variables
    const axiosClient = createAxiosClient();

    // ** Effect
    React.useEffect(() => {
        axiosClient.get(`product`, {
            params: {
                skip,
                take,
                search,
                categories: filterCategories,
                price,
            }
        }).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product[]>
            setProducts(result.response.data as unknown as ProductList)
        })
    }, [filterCategories, search, skip, take, price])

    // ** Function handle
    const handleOnChangePagination = (e: number) => {
        setSkip(e - 1)
    }

    const dataToRender = () => {
        if (products && products?.products && products.products.length) {
            return (
                <Row gutter={[16, 16]}>
                    {
                        products?.products?.map((p, index) => {
                            const price = p.product_variants.map((variant) => variant.price)
                            return <CardProduct key={index} span={6} name={p.name} id={p.id} img={p?.featured_asset?.url} max={Math.max(...price)} min={Math.min(...price)} />
                        })
                    }
                </Row>
            )
        }
        return null
    }


    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Input placeholder='Search by name' onChange={(e) => { setSearch(e.target.value); }} />
                </Col>
                <Col span={24}>
                    {dataToRender()}
                </Col>
                <Col span={24}>
                    {
                        products ? (
                            <Flex justifyContent="flex-end">
                                <Pagination
                                    total={products?.total || 0}
                                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                    defaultCurrent={skip + 1}
                                    onChange={handleOnChangePagination}
                                    defaultPageSize={take}
                                    responsive={true}
                                />
                            </Flex>
                        ) : null
                    }

                </Col>
            </Row>
        </Fragment>
    )
}

export default ListProduct