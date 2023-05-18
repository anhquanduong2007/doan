import { Box, Button, HStack, Image, Input, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useNumberInput } from '@chakra-ui/react'

import Product1 from '../../assets/product-01.jpg'
import React from 'react'

const Cart = () => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 2,
      min: 1,
      max: 6,
    })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()
  return (
    <div className='flex flex-row gap-3 justify-between'>
      <div className='w-[65%]'>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th isNumeric>Quantity</Th>
                <Th isNumeric>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td >
                  <div className='flex flex-row items-center gap-4'>
                    <Image src={Product1} boxSize='100px' objectFit='cover' objectPosition='top' alt='Dan Abramov' />
                    <p>Fresh Strawberries</p>
                  </div>
                </Td>
                <Td >$12.22</Td>
                <Td isNumeric>
                  <HStack justifyContent='end'>
                    <Button {...dec}>-</Button>
                    <Input width='50px' {...input} />
                    <Button {...inc}>+</Button>
                  </HStack>
                </Td>
                <Td isNumeric>$12.22</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
      <div className='w-[35%]'>
        Checkout
      </div>
    </div>
  )
}

export default Cart