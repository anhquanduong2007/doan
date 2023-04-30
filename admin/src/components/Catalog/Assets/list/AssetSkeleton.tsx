import { Card, Col, Skeleton } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React from 'react';

const AssetSkeleton = () => {
    return (
        <Col span={4}>
            <Card
                hoverable
                cover={<Skeleton.Image active={true} className='!w-full !h-72 !-h-72'/>}
            >
                <Skeleton.Input active={true} size='small' className='mb-1 !w-full'/>
                <Skeleton.Input active={true} size='small'/>
            </Card>
        </Col>
    );
};

export default AssetSkeleton;