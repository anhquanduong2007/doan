import React from 'react'
import Layout from '../Layout'
import Card1 from '../../assets/card/banner-01.jpg'
import Card2 from '../../assets/card/banner-02.jpg'
import Card3 from '../../assets/card/banner-03.jpg'

const Card = () => {
  const dataCard = [
    {
      id: 1,
      category: 'Women',
      season: 'Spring 2018',
      image: Card1
    },
    {
      id: 2,
      category: 'Men',
      season: 'Spring 2018',
      image: Card2
    },
    {
      id: 3,
      category: 'Accessories',
      season: 'Spring 2018',
      image: Card3
    },
  ]
  return (
    <Layout>
      <div className="flex flex-row flex-wrap gap-4 justify-center items-center mt-5">
        {
          dataCard.map((item, index) => {
            return (
              <div className='relative border-[1px] border-borderColor lg:w-[calc(calc(100%/2)-1rem)] xl:w-[calc(calc(100%/3)-1rem)] 2xl:w-[calc(calc(100%/3)-1rem)] hover:cursor-pointer' key={index}>
                <img src={item.image} alt="" />
                <div className='absolute top-0 left-0 bottom-0 right-0 p-4 hover:bg-hoverCard hover:text-white transition duration-300'>
                  <p className='font-bold text-3xl'>{item.category}</p>
                  <p>{item.season}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </Layout>
  )
}

export default Card
