import React, { Fragment } from 'react'
import Layout from '../Layout/layout'
import { useForm, Controller } from "react-hook-form"
import './productDetail.css'
import formatMoney from 'src/shared/utils/formatMoney';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, FormControl, HStack, Input, Select, useToast } from '@chakra-ui/react';
import { ChevronRight } from 'react-feather';
import { useNavigate, useParams } from 'react-router-dom';
import { createAxiosClient, createAxiosJwt } from 'src/axios/axiosInstance';
import { IAxiosResponse, Product, ProductOption } from 'src/types';
import Loading from 'src/components/Loading';
import { addToCart } from 'src/features/cart/action';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';

const ProductDetail = () => {
  // ** Variables
  const cart = useAppSelector((state) => state.cart);
  const axiosClient = createAxiosClient();
  const dispatch = useAppDispatch();
  const axiosClientJwt = createAxiosJwt();

  // ** State
  const [product, setProduct] = React.useState<Product>()
  const [variantId, setVariantId] = React.useState<number>()

  // ** Third party
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const { control, setValue, handleSubmit } = useForm({
    defaultValues: {
      quantity: 1
    }
  })

  // ** Effect
  React.useEffect(() => {
    axiosClient.get(`product/${id}`).then((res) => {
      const result = { ...res } as unknown as IAxiosResponse<Product>
      setProduct(result.response.data)
    })
  }, [])

  React.useEffect(() => {
    if (product) {
      setVariantId(product.product_variants[0]?.id)
    }
  }, [product])

  // ** Function handle
  const renderVariantOption = (data: { product_option: ProductOption }[]) => {
    const arrayVariantOption: any = []
    data.forEach(element => {
      arrayVariantOption.push(element.product_option.value)
    });
    return arrayVariantOption.toString().replace(',', ' ')
  }

  const onChangeVariant = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setVariantId(+event.target.value)
  }

  const onSubmit = (data: { quantity: number }) => {
    if (id) {
      addToCart({
        axiosClientJwt,
        cart: {
          quantity: data.quantity
        },
        dispatch,
        id: variantId ? variantId : 0,
        navigate,
        toast
      })
    }
  }

  return (
    <React.Fragment>
      {
        product ? (
          <Layout>
            <Breadcrumb spacing='8px' marginBottom='35px' separator={<ChevronRight size={14} />}>
              <BreadcrumbItem>
                <BreadcrumbLink href='/' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Home</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href='/products' className='hover:text-primary hover:no-underline transition duration-150 text-sm font-medium'>Products</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink href='#' className='!text-[#999] text-sm font-medium'>{product.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className='flex flex-row justify-evenly'>
              <div className='w-[24%]'>
                <img src={product.product_variants.find((variant) => variant.id === variantId)?.featured_asset?.url ?
                  product.product_variants.find((variant) => variant.id === variantId)?.featured_asset?.url :
                  "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/134557216-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                } alt='' className='w-full object-cover rounded-md' />
              </div>
              <div className='w-[50%]'>
                <div className='flex flex-col gap-3'>
                  <p className='font-bold text-2xl'>{product.name}</p>
                  <p className='font-bold text-sm' style={{ color: "gray" }}>{product.product_variants.find((variant) => variant.id === variantId)?.sku}</p>
                  <p className='font-bold text-lg'>{formatMoney(product.product_variants.find((variant) => variant.id === variantId)?.price || 0)}</p>
                  {/* <form > */}
                  <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>Select option</p>
                    <Fragment>
                      <Select value={variantId} onChange={onChangeVariant}>
                        {
                          product.product_variants.map((item, index) => {
                            const variantOption = renderVariantOption(item.product_options)
                            return (
                              <option value={item.id} key={item.id}>{`${product.name} ${variantOption}`}</option>
                            )
                          })
                        }
                      </Select>
                    </Fragment>
                  </div>
                  <p className='font-bold text-sm'>Available: {(product.product_variants.find((variant) => variant.id === variantId)?.stock || 0)}</p>
                  <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>Quantity</p>
                    <FormControl>
                      <Controller
                        name='quantity'
                        control={control}
                        render={({ field: { value } }) => (
                          <Fragment>
                            <HStack maxW='320px'>
                              <Button onClick={() => {
                                if (value > 1) {
                                  setValue('quantity', value - 1)
                                }
                              }}>-</Button>
                              <Input width={'60px'} value={value} onChange={(e) => setValue('quantity', parseInt(e.target.value))} />
                              <Button onClick={() => {
                                if (value < 50) {
                                  setValue('quantity', value + 1)
                                }
                              }}>+</Button>
                            </HStack>
                          </Fragment>
                        )}
                      />
                    </FormControl>
                  </div>
                  <div className='flex flex-row items-center gap-5 mt-2'>
                    {
                      product.product_variants.find((variant) => variant.id === variantId)?.stock || 0 > 0 ? (
                        <Button
                          className='!bg-primary text-white hover:!bg-[#5866c9]'
                          variant='solid'
                          isLoading={cart.addToCart.loading}
                          onClick={handleSubmit(onSubmit)}
                        >
                          Add to cart
                        </Button>
                      ) : null
                    }

                  </div>
                  {/* </form> */}
                  <p className='text-[#666]' dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              </div>
            </div>
          </Layout>
        ) : <Loading />
      }
    </React.Fragment>
  )
}
export default ProductDetail