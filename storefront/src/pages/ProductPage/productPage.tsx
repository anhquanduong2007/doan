import React from 'react'
import FilterProduct from 'src/components/FilterProduct/filterProduct'
import ListProduct from 'src/components/ListProduct/listProduct'
import Layout from 'src/components/Layout/layout'


const ProductPage = () => {
  return (
    <Layout>
      <div className='flex flex-row mt-32 gap-5'>
        <div className='w-[30%]'>
          <FilterProduct />
        </div>
        <div className='w-[65%]'>
          <ListProduct />
        </div>
      </div>
    </Layout>
  )
}

export default ProductPage