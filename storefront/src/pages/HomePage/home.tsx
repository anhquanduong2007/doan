import * as React from 'react';
import Slider from '../../components/Slider';
import Card from '../../components/Card';
import Layout from '../../components/Layout'
import CardProduct from '../../components/CardProduct';

const HomePage = () => {

  return (
    <>
      <Slider />
      <Card />
      <Layout>
        <div className='mt-16'>
          <p className='font-bold text-5xl uppercase'>New Arrivals</p>
          <div className='mt-5'>
            <ul className='flex flex-row gap-4'>
              <li className='hover:cursor-pointer hover:text-[black] hover:border-b border-[black] box-border transition duration-300 border-b text-[black]'>All products</li>
              <li className='hover:cursor-pointer hover:text-[black] text-[gray] hover:border-b border-[black] box-border transition duration-300 '>Women</li>
              <li className='hover:cursor-pointer hover:text-[black] text-[gray] hover:border-b border-[black] box-border transition duration-300 '>Man</li>
            </ul>
          </div>
          <div className='flex flex-row gap-4 flex-wrap mt-5'>
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;