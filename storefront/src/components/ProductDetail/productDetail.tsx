import React, { Fragment } from 'react'

import Layout from '../Layout/layout'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay } from 'swiper';
import { useForm, Controller } from "react-hook-form"

import './productDetail.css'
import Product1 from '../../assets/product-01.jpg'
import Product2 from '../../assets/product-02.jpg'
import Product3 from '../../assets/product-03.jpg'
import Product4 from '../../assets/product-04.jpg'
import formatMoney from 'src/shared/utils/formatMoney';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, FormControl, HStack, Input, Select, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs, useNumberInput, useRadio, useRadioGroup } from '@chakra-ui/react';
import { ChevronRight, Heart } from 'react-feather';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { productDetail, addToCart } from '../../features/product/productSlice'

const ProductDetail = () => {
  const [isFavourite, setIsFavourite] = React.useState(false)
  const { id } = useParams()
  const dispatch = useDispatch()
  const storeProductDetail: any = useSelector<any>(state => state.product?.detail?.data)

  const dataSlider = [
    { id: '1', src: Product1 },
    { id: '2', src: Product2 },
    { id: '3', src: Product3 },
    { id: '4', src: Product4 },
  ]

  const favouriteProduct = () => {
    setIsFavourite(!isFavourite)
  }

  console.log('storeProductDetail?.data?.product_variants[0]?.id', storeProductDetail?.data?.product_variants[0]?.id)

  const defaultValues = {
    variantOption: undefined,
    quantity: 1,
  }

  const {
    control,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = (data: { variantOption: number, quantity: number }) => {
    const { variantOption, quantity } = data
    dispatch(addToCart({ 
      quantity, idProductVariant: variantOption 
    }))
  }

  const renderVariantOption = (data: any) => {
    const arrayVariantOption: any = []
    data.forEach(element => {
      arrayVariantOption.push(element.product_option.value)
    });

    return arrayVariantOption.toString().replace(',', ' ')
  }

  React.useEffect(() => {
    if (id) {
      dispatch(productDetail(id))
    }
  }, [id])

  React.useEffect(() => {
    setValue('variantOption', storeProductDetail?.data?.product_variants[0]?.id)
  },[storeProductDetail])

  return (
    <Layout>
      <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
        <BreadcrumbItem>
          <BreadcrumbLink href='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href='/products' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Products</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href='#' className='!text-[#999] text-sm font-medium'>Contact</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className='flex flex-row gap-3'>
        <div className='w-[60%]'>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay]}
            autoplay
            effect="fade"
            spaceBetween={50}
            slidesPerView={1}
            navigation
            style={{
              width: '70%',
              overflow: 'visible'
            }}
            pagination={{
              clickable: true,
              renderBullet: (index, className) => {
                return `<div style="width: 80px;  height: auto; border-radius: unset;" class=${className}>
                <img src=${Product1} alt/>
                </div>
                `
              }
            }}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
          >
            {
              dataSlider && dataSlider.map((item, index) => {
                return (
                  <SwiperSlide className="relative w-[70%]" key={index}>
                    <div className="flex flex-col absolute top-1/2 z-20 left-[10%] translate-y-[-50%]">
                    </div>
                    <div className=''>
                      <img src={item.src} alt="" />
                    </div>

                  </SwiperSlide>
                )
              })
            }
          </Swiper>
        </div>
        <div className='w-[40%]'>
          <div className='flex flex-col gap-3'>
            <p className='font-bold text-xl'>{storeProductDetail?.data.name}</p>
            <p className='font-bold'>{formatMoney(12345)}</p>
            <p className='text-[#666]'>{storeProductDetail?.data.description}</p>
            {/* <form > */}
            <div className='flex flex-col gap-2'>
              <p className='font-semibold'>Select option</p>
              <FormControl>
                <Controller
                  name='variantOption'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Fragment>
                      <Select value={value} onChange={onChange}>
                        {
                          storeProductDetail?.data?.product_variants.map((item, index) => {
                            const variantOption = renderVariantOption(item.product_options)

                            return (
                              <option value={item.id} key={item.id}>{`${storeProductDetail?.data.name} ${variantOption}`}</option>
                            )
                          })
                        }
                      </Select>
                    </Fragment>
                  )}
                />
              </FormControl>

            </div>
            <div className='flex flex-col gap-2'>
              <p className='font-semibold'>Quantity</p>
              <FormControl>
                <Controller
                  name='quantity'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Fragment>
                      <HStack maxW='320px'>
                        <Button onClick={() => setValue('quantity', value - 1)}>-</Button>
                        <Input width={'60px'} value={value} onChange={(e) => setValue('quantity', parseInt(e.target.value))} />
                        <Button onClick={() => setValue('quantity', value + 1)}>+</Button>
                      </HStack>
                    </Fragment>
                  )}
                />
              </FormControl>

            </div>

            <div className='flex flex-row items-center gap-5 mt-2'>
              <Button
                className='!bg-primary text-white uppercase hover:!bg-[#5866c9]'
                variant='solid'
                isLoading={false}
                onClick={handleSubmit(onSubmit)}
              >
                Add to cart
              </Button>
              <Heart size={24} className={isFavourite ? `cursor-pointer fill-pink stroke-pink` : `cursor-pointer`} onClick={() => favouriteProduct()} />
            </div>
            {/* </form> */}
          </div>
        </div>
      </div>
      <Divider className='mt-16 mb-5' />
      <div className='flex justify-center'>
        <Tabs variant="unstyled" >
          <TabList display='flex' justifyContent='center'>
            <Tab>Description</Tab>
            <Tab>Review</Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
          />
          <TabPanels className='mt-5'>
            <TabPanel>
              <p>
                Aenean sit amet gravida nisi. Nam fermentum est felis, quis feugiat nunc fringilla sit amet. Ut in blandit ipsum. Quisque luctus dui at ante aliquet, in hendrerit lectus interdum. Morbi elementum sapien rhoncus pretium maximus. Nulla lectus enim, cursus et elementum sed, sodales vitae eros. Ut ex quam, porta consequat interdum in, faucibus eu velit. Quisque rhoncus ex ac libero varius molestie. Aenean tempor sit amet orci nec iaculis. Cras sit amet nulla libero. Curabitur dignissim, nunc nec laoreet consequat, purus nunc porta lacus, vel efficitur tellus augue in ipsum. Cras in arcu sed metus rutrum iaculis. Nulla non tempor erat. Duis in egestas nunc.
              </p>
            </TabPanel>
            <TabPanel>
              <p>Review!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </Layout>
  )
}

export default ProductDetail