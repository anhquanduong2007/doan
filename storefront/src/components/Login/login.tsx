import React, { Fragment } from 'react'

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Text,
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'react-feather';
import { useForm, Controller } from "react-hook-form"

import { useDispatch, useSelector } from 'react-redux'

import { login } from '../../features/auth/authSlice'

import { AuthState } from '../../features/auth/authSlice';
import { IResponse } from 'src/shared/api/types';
import { setAuthToken } from 'src/axios/axios';
export interface AuthSlice {
  auth: AuthState
  value: any
  _persist: any
}

const Login = () => {
  const dispatch = useDispatch()
  const storeAuth: any = useSelector<AuthSlice>(state => state.auth)
  const [showPassword, setShowPassword] = React.useState(false);
  const defaultValues = {
    email: undefined,
    password: undefined,
  }

  const {
    control,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const onSubmit = (data: { email: string, password: string }) => {
    dispatch(login(data))
  }

  React.useEffect(() => {
    if(storeAuth.login.data && storeAuth.login.data?.success && storeAuth.login.data?.access_token) {
      setAuthToken(storeAuth.login.data.access_token)
    }
  },[storeAuth])

  return (
    <div className='p-5'>
      <form className='flex flex-col gap-y-6'>
        <FormControl>
          <Controller
            name='email'
            control={control}
            rules={{ required: true, pattern: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/}}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>Email address</FormLabel>
                <Input
                  isInvalid={errors.email?.type === 'required' ? true : false}
                  type='email'
                  onChange={onChange}
                  value={value}
                />
                {errors?.email || storeAuth.login.data?.fieldError == 'email' ? <span className="text-danger">{errors.email?.type === 'required' ? <Text color='red' >Email is required !!</Text> : <Text color='red' >{storeAuth.login.data?.message ? storeAuth.login.data?.message[0] : 'Something went wrong'}</Text>}</span> : null}
              </Fragment>
            )}
          />
        </FormControl>

        <FormControl>
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                  <Input
                    isInvalid={errors.password?.type === 'required' || storeAuth.login.data?.fieldError ? true : false}
                    pr='4.5rem'
                    type={showPassword ? 'text' : 'password'}
                    onChange={onChange}
                    value={value}
                  />
                  <InputRightElement width='3.5rem'>
                    <Button h='1.75rem' size='sm' background='transparent' onClick={handleClickShowPassword}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors?.password || storeAuth.login.data?.fieldError == 'password' ? <span className="text-danger">{errors.password?.type === 'required' ? <Text color='red' >Password is required !!</Text> : <Text color='red' >{storeAuth.login.data.message ? storeAuth.login.data.message[0] : 'Something went wrong'}</Text>}</span> : null}
              </Fragment>
            )}
          />
        </FormControl>
        <Button
          isLoading={storeAuth && storeAuth.login?.loading ? true : false}
          colorScheme='blue'
          loadingText='Loading...'
          onClick={handleSubmit(onSubmit)}
        >
          Sign In
        </Button>
        {/* <Link></Link> */}
        {/* <div className='mb-1 col-5'>
          <Label className='form-label' for='note'>
            Ghi chú
          </Label>
          <Controller
            name='note'
            control={control}
            render={({ field }) => (
              <Input
                type='textarea'
                id='note'
                placeholder='ghi chú'
                invalid={errors.note && true}
                {...field}
              />
            )}
          />
        </div> */}
      </form>
    </div >
  )
}

export default Login