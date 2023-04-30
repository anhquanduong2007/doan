import * as React from 'react';
import { Badge, Button, Col, Layout, Menu, Row } from 'antd';
import logo from 'src/assets/logo/logo.png';
import Icon from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { FaBell } from "react-icons/fa";
import { logOut } from 'src/features/auth/actions';
import { useNavigate } from 'react-router-dom';
import { createAxiosJwt } from "src/helper/axiosInstance";
import { loginSuccess, logOutSuccess } from 'src/features/auth/authSlice';
import { AuthLoginResponse } from 'src/types';
import SiderBar from 'src/components/Sider/sider';

const { Header, Footer, Sider, Content } = Layout;

const Home = () => {

    const navigate = useNavigate();

    const userLoginInfo = useAppSelector((state) => state.auth.login?.currentUser);

    const dispatch = useAppDispatch();

    const axiosClientJwt = createAxiosJwt(userLoginInfo as unknown as AuthLoginResponse, dispatch, loginSuccess);

    const handleLogout = () => {
        const accessToken = userLoginInfo?.response.accessToken ? userLoginInfo?.response?.accessToken : '';
        logOut(dispatch, navigate, accessToken, axiosClientJwt)
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className='!bg-white relative z-10 max-w-full shadow-[0_2px_8px_#f0f1f2]'>
                <Row justify='start' align='middle' className='h-full' >
                    <Col span={4}>
                        <Link to='/'>
                            <img src={logo} alt='Logo' />
                        </Link>
                    </Col>
                    <Col span={14}>
                        {/* <Menu mode="horizontal" className='!border-0'>
                            <Menu.Item key='2'>
                                <Link to='/users'>Users</Link>
                            </Menu.Item>
                            <Menu.Item key='3'>item 2</Menu.Item>
                        </Menu> */}
                    </Col>
                    <Col span={6}>
                        {/* <Menu mode="horizontal" className='justify-end !border-0'>
                            <Menu.Item key='1'>
                                <Badge size="default" count={5}>
                                    <Icon component={FaBell} style={{ fontSize: '20px' }} />
                                </Badge>
                            </Menu.Item>
                            <Menu.SubMenu key="info-user" title={`Hi, ${userLoginInfo && userLoginInfo?.response.user.first_name} ${userLoginInfo && userLoginInfo?.response.user.last_name}`}>
                                <Menu.Item key="home" >
                                    Home
                                </Menu.Item>
                                <Menu.Item key="profile" >
                                    Profile
                                </Menu.Item>
                                <Menu.Item key="settings" >
                                    Settings
                                </Menu.Item>
                                <Menu.Item key="logout" onClick={handleLogout}>
                                    Logout
                                </Menu.Item>
                            </Menu.SubMenu>
                        </Menu> */}
                    </Col>
                </Row>
            </Header>
            <Layout>
                <SiderBar />
                <Content style={{ padding: '1.5rem', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;