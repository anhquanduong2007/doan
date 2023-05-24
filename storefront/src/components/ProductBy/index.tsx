import React from 'react';
import CardProduct from '../CardProduct/cardProduct';
import { createAxiosClient } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product } from 'src/shared/types';
import { Row, Col } from 'antd'

interface ProductByProps {
    title: string,
    url: string
}

const ProductBy = ({ title, url }: ProductByProps) => {
    // ** Variables
    const axiosClient = createAxiosClient();

    // ** State
    const [product, setProduct] = React.useState<Product[]>([])

    // ** Effect
    React.useEffect(() => {
        axiosClient.get(url).then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product[]>
            setProduct(result.response.data)
        })
    }, [])

    // ** Function handle
    const dataToRender = () => {
        if (product && product.length) {
            return (
                <Row>
                    <Col span={24}>
                        <p className='font-bold text-3xl uppercase text-center'>{title}</p>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16, 16]}>
                            {
                                product.map((p, index) => {
                                    const price = p.product_variants.map((variant) => variant.price)
                                    return <CardProduct key={index} span={4} name={p.name} id={p.id} img={p?.featured_asset?.url} max={Math.max(...price)} min={Math.min(...price)} />
                                })
                            }
                        </Row>

                    </Col>
                </Row>
            )
        }
        return null
    }
    return (
        <React.Fragment>
            {dataToRender()}
        </React.Fragment>
    );
};

export default ProductBy;