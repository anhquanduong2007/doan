import React from 'react'

import CardProduct from '../CardProduct'

const ListProduct = () => {
  return (
    <div className='flex flex-row gap-4 flex-wrap'>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
      <CardProduct style='lg:!w-[calc(calc(100%/3)-1rem)] md:!w-[calc(calc(100%/2)-1rem)] sm:!w-[calc(calc(100%/1)-1rem)]'/>
    </div>
  )
}

export default ListProduct