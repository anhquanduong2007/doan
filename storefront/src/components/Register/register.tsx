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

// import { register } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const dispatch = useDispatch()
  const defaultValues = {
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    email: undefined,
    password: undefined,
  }

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const onSubmit = (data: any) => {
    const { email, password, firstName, lastName, phoneNumber } = data
    // dispatch(register({
    //   email,
    //   password,
    //   first_name: firstName,
    //   last_name: lastName,
    //   phoneNumber: phoneNumber
    // }))
  }

  return (
    <div className='p-5'>
      <form className='flex flex-col gap-y-6'>
        <FormControl>
          <Controller
            name='firstName'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>First Name</FormLabel>
                <Input
                  type='firstName'
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
            name='lastName'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type='lastName'
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
            name='phoneNumber'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type='phoneNumber'
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
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Fragment>
                <FormLabel>Email</FormLabel>
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
          loadingText='Register...'
          onClick={handleSubmit(onSubmit)}
        >
          Register
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

export default Register