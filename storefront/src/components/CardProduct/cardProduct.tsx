import React from 'react'
import { Link } from 'react-router-dom'
interface CardProductProps {
  name: string
  id: number
  img: string
}

const CardProduct = ({ name, id, img }: CardProductProps) => {
  console.log(id)
  return (
    <div className={`flex flex-col gap-y-1 lg:w-[calc(calc(100%/4)-1rem)] md:w-[calc(calc(100%/3)-1rem)] sm:w-[calc(calc(100%/2)-1rem)]`}>
      <div className='relative overflow-hidden'>
        <img src={img ? img : 'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png'} alt="" className='w-full h-full object-cover transition duration-700 hover:scale-110 max-h-[500px]' />
      </div>
      <Link to={`/products/${id}`} className='text-[#999] hover:text-primary transition duration-200 text-lg'>{name}</Link>
      <p className='text-[#666]'>$16.64</p>
    </div>
  )
}

export default CardProduct
