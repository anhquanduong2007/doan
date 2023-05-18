import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'

const ProtectedRoute = ({ children }: any) => {
  const storeAuth: any = useSelector<any>(state => state.auth.login)

  const toast = useToast()

  if (!storeAuth && !storeAuth?.data?.success) {
    toast({
      title: `You must be logged in`,
      status: 'error',
      isClosable: true,
    })
    return <Navigate to='/' />
  }

  return children
}

export default ProtectedRoute