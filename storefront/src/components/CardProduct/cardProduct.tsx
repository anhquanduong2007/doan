import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Card, Tag, Tooltip } from 'antd'
import formatMoney from 'src/shared/utils/formatMoney'
import { Box } from '@chakra-ui/react'
interface CardProductProps {
  name: string
  id: number
  img: string
  max: number
  min: number
  span: number
  variants: string[]
  category: string
}

const CardProduct = ({ name, id, img, min, max, span, variants, category }: CardProductProps) => {
  const color = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

  return (
    <Col span={span} className='!flex'>
      <Card
        className='flex-1'
        cover={<img alt="example" src={img ? img : 'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png'} className='p-5' />}
      >
        <Link to={`/products/${id}`} className='text-[#999] hover:text-primary transition duration-200 text-sm font-bold'>{name}</Link>
        {
          category && (
            <Box my={2}>
              <Box fontWeight="semibold">Category</Box>
              <Tag style={{ marginTop: "6px" }} >{category}</Tag>
            </Box>
          )
        }
        <Box my={2}>
          <Box fontWeight="semibold">Variants</Box>
          {
            variants?.map((variant, index) => {
              const random = Math.floor(Math.random() * color.length);
              return (
                <Tooltip title={variant}>
                  <Link to={`/products/${id}`}>
                    <Tag key={index} style={{ marginTop: "6px", width: "100px", textOverflow: "ellipsis", whiteSpace: 'nowrap', overflow: 'hidden' }} color={color[random]}>{variant}</Tag>
                  </Link>
                </Tooltip>
              )
            })
          }
        </Box>
        <p className='text-[#666] font-bold'>{`${formatMoney(min)} ~ ${formatMoney(max)}`}</p>
      </Card>
    </Col>
  )
}

export default CardProduct
