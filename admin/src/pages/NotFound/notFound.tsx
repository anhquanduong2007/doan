import * as React from 'react';
import notFoundImage from 'src/assets/illustrations/404.svg';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='max-w-[320px] flex flex-col justify-center items-center'>
                <img className='w-full mb-8' src={notFoundImage} alt='404-image' />
                <Button type="primary" size='large' onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        </div>
    );
};

export default NotFound;