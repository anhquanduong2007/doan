import React, { memo } from 'react';
import CardProduct from '../CardProduct/cardProduct';
import { createAxiosClient } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product } from 'src/types';

const NewArrivalsProduct = () => {
    // ** Variables
    const axiosClient = createAxiosClient();

    // ** State
    const [productNewArrivals, setProductNewArrivals] = React.useState<Product[]>([])

    // ** Effect
    React.useEffect(() => {
        axiosClient.get('product/new-arrivals').then((res) => {
            const result = { ...res } as unknown as IAxiosResponse<Product[]>
            setProductNewArrivals(result.response.data)
        })
    }, [])

    // ** Function handle
    const dataToRender = () => {
        if (productNewArrivals && productNewArrivals.length) {
            return (
                <div className='mt-16'>
                    <p className='font-bold text-5xl uppercase text-center'>New Arrivals</p>
                    <div className='flex flex-row gap-4 flex-wrap mt-5'>
                        {
                            productNewArrivals.map((product, index) => {
                                return <CardProduct key={index} name={product.name} id={product.id} img={product?.featured_asset?.url} />
                            })
                        }
                    </div>
                </div>
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

export default NewArrivalsProduct;