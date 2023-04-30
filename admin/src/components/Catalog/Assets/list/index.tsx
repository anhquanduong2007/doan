import { Breadcrumb, Card, Col, Row, Image, Input, Button, Pagination, Modal, Upload, UploadProps, message } from 'antd';
import Meta from 'antd/lib/card/Meta';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { deleteAsset, getListAsset } from 'src/features/asset/actions';
import { createAxiosClient } from "src/helper/axiosInstance";
import AssetSkeleton from './AssetSkeleton';
import { EyeOutlined } from '@ant-design/icons';
import './style.css';

const props = (): UploadProps => {
    return {
        name: 'files',
        action: 'http://localhost:1234/asset/upload',
        multiple: true,
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    }
};

const AssetList = () => {

    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assetSelected, setAssetSelected] = useState()
    const [loadingAsset, setLoadingAsset] = useState<boolean>(false);

    console.log(assetSelected)
    // ** Variables
    const navigate = useNavigate();
    const store = useAppSelector((state) => state.asset);
    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    useEffect(() => {
        getListAsset({
            pagination: {
                skip,
                take,
                search
            },
            axiosClient,
            dispatch,
            navigate
        });
    }, [skip, take])

    const dataToRender = () => {
        if (!store.list.loading && store.list.result && store.list.result?.assets?.length > 0) {
            return store.list.result?.assets
        }
        return []
    }

    const handleSearch = () => {
        getListAsset({
            pagination: {
                skip,
                take,
                search
            },
            axiosClient,
            dispatch,
            navigate
        });
    }

    const handleOnChangePagination = (e: number) => {
        setSkip(e - 1)
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    console.log(store);
    console.log(skip)
    return (
        <Fragment>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to='/'>Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Assets</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col span={24}>
                    <div className='flex'>
                        <div className='mr-3 flex-1'>
                            <Input type='text' placeholder='Search by asset name' onChange={(e) => setSearch(e.target.value)} onPressEnter={handleSearch} />
                        </div>
                        <Upload {...props()}>
                            <Button type="primary">Upload Assets</Button>
                        </Upload>

                    </div>
                    <div className='mt-5'>
                        <Row gutter={[12, 12]}>
                            {
                                store.list.loading ? Array.from(Array(take), (_item, index) => {
                                    return <AssetSkeleton key={index} />
                                }) : dataToRender().map((asset: any, index: number) => {
                                    return (
                                        <Col span={4} key={index}>
                                            <Card
                                                hoverable
                                                cover={<img alt="example" src={asset.url} className='max-h-72 h-72' />}
                                                onClick={() => {
                                                    setAssetSelected(asset)
                                                    setIsModalOpen(true)
                                                }}
                                            >
                                                <Meta title={asset.name} description={asset.url} />
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                    <div className='mt-5 flex justify-end pagination'>
                        {
                            store.list.loading ? null :
                                <Pagination
                                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                                    total={store.list.result?.total}
                                    defaultCurrent={skip + 1}
                                    onChange={handleOnChangePagination}
                                    defaultPageSize={take}
                                    responsive={true}
                                />}
                    </div>
                </Col>
            </Row>
            <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered>
                <Row>
                    <Col span={24}>
                        <img src={assetSelected?.url} className='w-full object-cover' />
                    </Col>
                    <Col span={24}>
                        <div className='flex flex-col'>
                            <Input value={assetSelected?.name} className='!mb-2' />
                            <div className='mb-2'><span className='font-bold'>Width:</span> {assetSelected?.width}</div>
                            <div className='mb-2'><span className='font-bold'>Height:</span> {assetSelected?.height}</div>
                            <div className='mb-2'><span className='font-bold'>Format:</span> {assetSelected?.format}</div>
                            <Link to={assetSelected?.url} target="_blank" className='flex justify-start items-center mb-2'>
                                <EyeOutlined />
                                <span className='ml-1'>Preview</span>
                            </Link>
                            {
                                !store.delete.loading ? <Button
                                    type="primary"
                                    danger
                                    onClick={() => {
                                        deleteAsset({ assetId: assetSelected?.id, axiosClient, dispatch, navigate })
                                        setTimeout(function () {
                                            setIsModalOpen(false)
                                            handleSearch()
                                        }, 1000)
                                    }}>
                                    Delete
                                </Button> : <Button type="primary" loading>Loading</Button>
                            }
                        </div>
                    </Col>
                </Row>
            </Modal>
        </Fragment>
    );
};

export default AssetList;