import React, { Fragment } from 'react';
import ProductBy from 'src/components/ProductBy';
import Slider from 'src/components/Slider/slider';

const MainPage = () => {
    return (
        <Fragment>
            <Slider />
            <div className='px-10 py-8'>
                <ProductBy title='Hàng mới đến' url="product/new-arrivals" />
                <ProductBy title='Bán chạy nhất' url="product/most-bought"/>
            </div>
        </Fragment>
    );
};

export default MainPage;