import React from 'react'
import { Link } from 'react-router-dom'

import './cardProduct.css'
import Product1 from '../../assets/product-01.jpg'

const CardProduct = (props:any) => {
  return (
    <div className={`flex flex-col gap-y-1 lg:w-[calc(calc(100%/4)-1rem)] md:w-[calc(calc(100%/3)-1rem)] sm:w-[calc(calc(100%/2)-1rem)]`}>
      <div className='relative overflow-hidden hover-showButton'>
        <img src={Product1} alt="" className='w-full h-full object-cover transition duration-700 hover:scale-110'/>
        <Link to='#' className='absolute px-5 py-3 bg-white rounded-full left-1/2 translate-x-[-50%] bottom-[-40%] opacity-0 hover:cursor-pointer show transition duration-500 ease-in-out whitespace-nowrap hover:bg-[black] hover:text-white'>Quick View</Link>
      </div>
      <Link to='#' className='text-[#999] hover:text-primary transition duration-200'>Esprit Ruffle Shirt</Link>
      <p className='text-[#666]'>$16.64</p>
    </div>
  )
}

export default CardProduct
