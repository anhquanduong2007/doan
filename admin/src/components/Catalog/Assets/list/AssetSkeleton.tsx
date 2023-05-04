import { Card, Col, Skeleton } from 'antd';
import React from 'react';

interface AssetSkeletonProps {
    height: number | string,
    span: number
}
const AssetSkeleton = ({ height, span }: AssetSkeletonProps) => {
    return (
        <Col span={span}>
            <Card
                hoverable
                cover={<Skeleton.Image active={true} style={{ marginBottom: "4px", width: "100%", height: typeof height === "number" ? height : `${height}` }} />}
            >
                <Skeleton.Input active={true} size='small' style={{ marginBottom: "4px", width: "100%" }} />
                <Skeleton.Input active={true} size='small' />
            </Card>
        </Col>
    );
};

export default AssetSkeleton;