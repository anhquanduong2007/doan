import { Breadcrumb, Card, Col, Row, Input, Button, Modal, Upload, UploadProps, message, Divider, Space, Table, Avatar } from 'antd';
import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { deleteAsset, getListAsset } from 'src/features/catalog/asset/actions';
import { createAxiosJwt } from "src/helper/axiosInstance";
import { Box, Flex } from '@chakra-ui/react';
import type { ColumnsType } from 'antd/es/table';
import {
    DeleteOutlined
} from '@ant-design/icons';
import { useDebounce } from 'use-debounce';

const props = (refresh: boolean, setRefresh: (refresh: boolean) => void): UploadProps => {
    const accessToken = localStorage.getItem("accessToken")
    return {
        name: 'files',
        action: 'http://localhost:1234/asset/upload',
        multiple: true,
        showUploadList: false,
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        onChange(info) {
            if (info.file.status === 'done') {
                setTimeout(function () {
                    setRefresh(!refresh)
                    message.success(`File uploaded successfully!`);
                }, 1000);
            } else if (info.file.status === 'error') {
                message.error(`File upload failed!`);
            }
        },

    }
};


interface DataType {
    key: number
    id: number
    name: string;
    url: string
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    setAssetDelete: (id: number) => void,
): ColumnsType<DataType> => [
        {
            title: 'name',
            dataIndex: 'name',
            ellipsis: true,
            key: 'name',
            render: (name, record) => {
                return (
                    <Flex alignItems={"center"}>
                        <Avatar src={<img src={record.url} style={{ width: 40 }} />} />
                        <Box ml={2}>{name}</Box>
                    </Flex>
                )
            }
        },
        {
            title: 'Url',
            ellipsis: true,
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setAssetDelete(record.id)
                        }} />
                    </Space>
                )
            },
        },
    ]

const Asset = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [search, setSearch] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [assetDelete, setAssetDelete] = useState<number>()
    const [refresh, setRefresh] = useState<boolean>(false)
    const [value] = useDebounce(search, 1000);

    // ** Variables
    const navigate = useNavigate();
    const store = useAppSelector((state) => state.asset);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    useEffect(() => {
        getListAsset({
            pagination: {
                skip,
                take,
                search: value
            },
            axiosClientJwt,
            dispatch,
            navigate
        });
    }, [skip, take, value, refresh])

    const dataRender = (): DataType[] => {
        if (!store.list.loading && store.list.result && store.list.result?.assets?.length > 0) {
            return store.list.result.assets.map((asset, index) => {
                return {
                    id: asset.id,
                    key: index,
                    name: asset.name,
                    url: asset.url
                }
            })
        }
        return []
    }

    const handleOnChangePagination = (e: number) => {
        setSkip(e - 1)
    }

    const handleOkDelete = () => {
        deleteAsset({
            axiosClientJwt,
            dispatch,
            id: assetDelete as number,
            message,
            navigate,
            refresh,
            setIsModalOpen,
            setRefresh
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
                    <Row>
                        <Col span={24}>
                            <Flex>
                                <Box mr={3} flex={1}>
                                    <Input type='text' placeholder='Search by asset name' onChange={(e) => { setSearch(e.target.value); }} />
                                </Box>
                                <Upload {...props(refresh, setRefresh)}>
                                    <Button type="primary">Upload Assets</Button>
                                </Upload>
                            </Flex>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table
                                    bordered
                                    columns={columns(setIsModalOpen, setAssetDelete)}
                                    dataSource={dataRender()}
                                    loading={store.list.loading}
                                    pagination={{
                                        total: store.list.result?.total,
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                        defaultCurrent: skip + 1,
                                        onChange: handleOnChangePagination,
                                        defaultPageSize: take,
                                        responsive: true
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Delete asset" open={isModalOpen} onOk={handleOkDelete} onCancel={handleCancel} centered confirmLoading={store.delete.loading}>
                <p>Do you want to delete this asset?</p>
            </Modal>
        </Fragment>
    );
};

export default Asset;