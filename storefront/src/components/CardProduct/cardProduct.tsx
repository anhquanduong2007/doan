import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Col, Card, Select, Tag } from 'antd'
import formatMoney from 'src/shared/utils/formatMoney'
import { Box, Button, Flex, useToast } from '@chakra-ui/react'
import { Product, ProductVariant } from 'src/shared/types'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { createAxiosJwt } from 'src/axios/axiosInstance'
import { addToCart } from 'src/features/cart/action'

interface CardProductProps {
   span: number
   product: Product
}

const noImg = 'https://inantemnhan.com.vn/wp-content/uploads/2017/10/no-image.png'

const CardProduct = ({ product, span }: CardProductProps) => {
   const [variant, setVariant] = useState<ProductVariant>()
   const [loading, setLoading] = useState<boolean>()

   useEffect(() => {
      setVariant({ ...product?.product_variants[0] })
   }, [product])

   const toast = useToast()
   const dispatch = useAppDispatch()
   const cart = useAppSelector((state) => state.cart)
   const axiosClientJwt = createAxiosJwt()

   const onChange = (value: number) => {
      setVariant(product?.product_variants?.find((variant) => variant.id === value)!)
   }

   useEffect(() => {
      if (!cart.addToCart.loading) {
         setLoading(false)
      }
   }, [cart.addToCart.loading])

   const handleAddToCard = () => {
      if (variant && variant?.stock > 0) {
         setLoading(true)
         addToCart({
            axiosClientJwt,
            cart: {
               quantity: 1
            },
            dispatch,
            id: variant?.id,
            toast,
         })
      } else {
         toast({
            status: 'warning',
            title: 'Sản phẩm này đã hết hàng!',
            isClosable: true,
            position: "top-right",
            variant: 'left-accent',
         })
      }
   }

   return (
      <Fragment>
         <Col span={span} className='!flex'>
            <Card
               className='flex-1'
               cover={<img src={variant && variant?.featured_asset?.url ? variant.featured_asset.url : product?.featured_asset?.url ? product?.featured_asset?.url : noImg} />}
               hoverable
               style={{ width: "100%" }}
            >
               <Link to={`/products/${product?.id}`} className='text-[#999] hover:text-primary transition duration-200 text-sm font-bold'>
                  <Box as='span' mr={2}>{product?.name}</Box>
                  <Tag color={variant?.stock ? 'green' : 'red'}>{variant && variant?.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</Tag>
               </Link>
               <Box className='text-[#666] font-bold'>{`${formatMoney(variant && (variant as any)?.price)}`}</Box>
               <Box as='div' mt='8px'>
                  <Select
                     value={variant?.id}
                     onChange={onChange}
                     style={{ width: '100%' }}
                     options={product?.product_variants.map((variant) => {
                        return {
                           value: variant?.id,
                           label: variant.name
                        }
                     })}
                  />
               </Box>
               <Flex justifyContent='flex-start' mt='10px'>
                  <Button size='sm' colorScheme='blue' borderRadius='3px' onClick={handleAddToCard} isLoading={loading}>
                     Thêm vào giỏ hàng
                  </Button>
               </Flex>
            </Card>
         </Col>
      </Fragment>

   )
}

export default CardProduct
