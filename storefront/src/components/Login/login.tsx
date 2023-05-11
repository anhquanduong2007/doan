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
} from '@chakra-ui/react'
import { Eye, EyeOff } from 'react-feather';
import { useForm, Controller } from "react-hook-form"

const Login = () => {
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

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const onSubmit = (data: any) => {
    console.log('onSubmit', data)
  }

  return (
    <div className='p-5'>
      <form className='flex flex-col gap-y-6'>
        <FormControl>
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>Email address</FormLabel>
                <Input
                  type='email'
                  onChange={onChange}
                  value={value}
                />
                {/* {!isError ? (
                  <FormHelperText>
                    Enter the email you'd like to receive the newsletter on.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>Email is required.</FormErrorMessage>
                )} */}
                {/* {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null} */}
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
                {/* {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null} */}
              </Fragment>
            )}
          />
        </FormControl>
        <Button
          isLoading={false}
          colorScheme='blue'
          loadingText='Login...'
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