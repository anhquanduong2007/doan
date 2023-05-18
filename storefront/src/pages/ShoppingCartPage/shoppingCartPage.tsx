import React from 'react'

import Cart from 'src/components/Cart/cart'
import Layout from 'src/components/Layout/layout'

const ShoppingCartPage = () => {
  return (
    <Layout>
      <div className='mt-32'>
        <Cart />
      </div>
    </Layout>
  )
}

export default ShoppingCartPage