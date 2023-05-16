import React from 'react'
import { Link } from 'react-router-dom'

import './cardProduct.css'
import Product1 from '../../assets/product-01.jpg'
import { Heart, Search, ShoppingCart } from 'react-feather'
import { Button } from '@chakra-ui/react'



const CardProduct = (props: any) => {
  const { style } = props
  return (
    <div className={`flex flex-col gap-y-1 lg:w-[calc(calc(100%/4)-1rem)] md:w-[calc(calc(100%/3)-1rem)] sm:w-[calc(calc(100%/2)-1rem)] ${style} `}>
      <div className='relative overflow-hidden hover-showButton'>
        <img src={Product1} alt="" className='w-full h-full object-cover transition duration-700 hover:scale-110' />
        <div className='absolute flex flex-row gap-2 px-5 py-3 bg-transparent left-1/2 translate-x-[-50%] bottom-[-40%] opacity-0 hover:cursor-pointer show transition duration-500 ease-in-out whitespace-nowrap'>
          <div className='p-1 bg-white hover:bg-[black] hover:text-white transition duration-700'>
            <Search size={18} />
          </div>
          <div className='p-1 bg-white hover:bg-[black] hover:text-white transition duration-700'>
            <ShoppingCart size={18} />
          </div>
          <div className='p-1 bg-white hover:bg-[black] hover:text-white transition duration-700'>
            <Heart
              className='transition duration-70'
              // style={{ fill: 'red', stroke: 'red' }}
              size={18}
            />
          </div>
        </div>
      </div>
      <Link to='#' className='text-[#999] hover:text-primary transition duration-200'>Esprit Ruffle Shirt</Link>
      <p className='text-[#666]'>$16.64</p>
    </div>
  )
}

export default CardProduct
