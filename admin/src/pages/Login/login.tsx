import * as React from 'react';
import { Col, Row, Button, Space } from 'antd';
import { useForm, SubmitHandler } from 'react-hook-form';
import autoAnimate from '@formkit/auto-animate'
import loginImage from 'src/assets/illustrations/dreamer.svg';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'src/features/auth/actions';
import { createAxiosClient } from "src/helper/axiosInstance";

type Inputs = {
    email: string,
    password: string,
}

const Login: React.FC = () => {

    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth.login);

    const navigate = useNavigate();

    const axiosClient = createAxiosClient();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
        loginUser({ email, password }, dispatch, navigate, setError, axiosClient);
    };

    const emailErrorRef = React.useRef(null);
    const passwordErrorRef = React.useRef(null);
    React.useEffect(() => {
        emailErrorRef.current && autoAnimate(emailErrorRef.current);
        passwordErrorRef.current && autoAnimate(passwordErrorRef.current)
    }, [parent])

    return (
        <div className='bg-[#1A2038] min-h-screen flex justify-center items-center'>
            <div className='max-w-[800px] min-h-[400px] flex rounded-xl justify-center items-center mx-[4px] my-[4px] bg-white text-[rgba(52, 49, 76, 1)]'>
                <Row>
                    <Col span={12}>
                        <div className='px-8 py-8 h-full flex items-center justify-center min-w-[320px]'>
                            <img src={loginImage} alt='Login Image' width='100%' />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className='h-full px-8 py-8 relative bg-[rgba(0,0,0,0.01)]'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Space direction='vertical' size='middle' style={{ width: '100%' }}>
                                    <div className='flex flex-col' ref={emailErrorRef}>
                                        <input
                                            className={`${auth.isFetching ? 'pointer-events-none opacity-50' : ''} relative inline-block w-full min-w-0 px-[12px] py-1 text-[#000000d9] text-sm bg-white leading-[1.5715] border border-[#d9d9d9] rounded-sm transition duration-300 hover:border-[#40a9ff] focus:border-[#40a9ff] focus:outline-0 focus:shadow-input`}
                                            placeholder='Email'
                                            type='email'
                                            {...register('email', { required: 'Email is required!' })} />
                                        {errors.email && <span className='mt-1 text-error' >{errors.email.message}</span>}
                                    </div>
                                    <div className='flex flex-col' ref={passwordErrorRef}>
                                        <input
                                            className={`${auth.isFetching ? 'pointer-events-none opacity-50' : ''} relative inline-block w-full min-w-0 px-[12px] py-1 text-[#000000d9] text-sm bg-white leading-[1.5715] border border-[#d9d9d9] rounded-sm transition duration-300 hover:border-[#40a9ff] focus:border-[#40a9ff] focus:outline-0 focus:shadow-input`}
                                            placeholder='Password'
                                            {...register('password', { required: 'Password is required' })}
                                            type='password'
                                        />
                                        {errors.password && <span className='mt-1 text-error'>{errors.password.message}</span>}
                                    </div>
                                    {
                                        auth.isFetching ? <Button type="primary" loading>Loading...</Button> : <Button type='primary' htmlType='submit'>Login</Button>
                                    }
                                </Space>
                            </form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Login;