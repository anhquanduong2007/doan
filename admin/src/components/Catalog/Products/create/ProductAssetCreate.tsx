import { Flex } from '@chakra-ui/react';
import { Button, Col, Divider, Input, Modal, Row, Space, Upload, Pagination, Card, Image, Tooltip, Checkbox } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { getListAsset } from 'src/features/catalog/asset/actions';
import { createAxiosClient } from 'src/helper/axiosInstance';
// import AssetSkeleton from '../../Assets/list/AssetSkeleton';

interface AssetItemProps {
    title: string
    url: string
}
const AssetItem = ({ title, url }: AssetItemProps) => {
    return (
        <Fragment>
            <Col span={6}>
                <Card
                    hoverable
                    style={{ width: "100%" }}
                    cover={
                        <img
                            alt="example"
                            width={"100%"}
                            src={url}
                            style={{
                                height: "200px",
                                maxHeight: "200px",
                                padding: "10px",
                                objectFit: "cover"
                            }}
                        />
                    }
                >
                    <Card.Meta title={
                        <Tooltip title={title}>
                            <span>{title}</span>
                        </Tooltip>
                    }
                        description={
                            <Flex justifyContent="center">
                                <Checkbox></Checkbox>
                            </Flex>
                        }
                    />
                </Card>
            </Col>
        </Fragment>
    )
}
const ProductAssetCreate = () => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')

    // ** Variables
    const store = useAppSelector((state) => state.asset);
    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    // ** Effect
    useEffect(() => {
        if (isModalOpen) {
            getListAsset({
                pagination: {
                    skip,
                    take,
                    search
                },
                axiosClient,
                dispatch,
            });
        }
    }, [skip, take, isModalOpen])

    console.log(store)
    // ** Function handle
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOnChangePagination = (e: number) => {
        setSkip(e - 1)
    }

    const assetsToRender = () => {
        if (!store.list.loading && store.list.result && store.list.result?.assets?.length) {
            return store.list.result.assets.map((asset, index: number) => {
                return <AssetItem key={index} title={asset.name} url={asset.url} />
            })
        }
        // return Array.from(Array(take), (_item, index) => {
        //     return <AssetSkeleton key={index} height="200px" span={6} />
        // })
        return []
    }

    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Flex justifyContent="flex-end" alignItems="center">
                        <Button onClick={showModal}>Add aseet</Button>
                    </Flex>
                </Col>
                <Col span={24}>
                    <div></div>
                </Col>
            </Row>
            <Modal title="Select assets" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered width={1000}>
                <Row>
                    <Col span={24}>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <Input placeholder='Search asset' />
                            <Upload
                                name="files"
                                action='http://localhost:1234/asset/upload'
                                multiple={true}
                                showUploadList={false}
                            >
                                <Button>Upload aseet</Button>
                            </Upload>
                        </div>
                    </Col>
                    <Divider />
                    <Col span={24}>
                        <Row gutter={[16, 16]} style={{ height: 500, overflowY: "scroll", padding: "20px 0" }}>
                            {assetsToRender()}
                        </Row>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                            <Pagination
                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                total={store.list.result?.total}
                                defaultCurrent={skip + 1}
                                onChange={handleOnChangePagination}
                                defaultPageSize={take}
                                responsive={true}
                            />
                        </div>
                    </Col>
                </Row>
            </Modal>
        </Fragment>
    );
};

export default ProductAssetCreate;