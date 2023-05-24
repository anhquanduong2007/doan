import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Card } from 'antd'
import formatMoney from 'src/shared/utils/formatMoney'
interface CardProductProps {
  name: string
  id: number
  img: string
  max: number
  min: number
  span: number
}

const CardProduct = ({ name, id, img, min, max, span }: CardProductProps) => {
  return (
    <Col span={span} className='!flex'>
      <Card
        className='flex-1'
        cover={<img alt="example" src={img ? img : 'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png'} className='p-5' />}
      >
        <Link to={`/products/${id}`} className='text-[#999] hover:text-primary transition duration-200 text-sm'>{name}</Link>
        <p className='text-[#666]'>{`${formatMoney(min)} ~ ${formatMoney(max)}`}</p>
      </Card>
    </Col>
  )
}

export default CardProduct
