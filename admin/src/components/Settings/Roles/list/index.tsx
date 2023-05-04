import { Breadcrumb, Button, Col, Divider, Row, Table, Space, Tag, Modal, Card, message, Tooltip } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { Link, NavigateFunction } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosClient } from 'src/helper/axiosInstance';
import { deleteRole, getListRole } from 'src/features/setting/role/actions';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';

interface DataType {
    key: number;
    id: number;
    description: string;
    code: string;
    permissions: string[];
}

const columns = (
    setIsModalOpen: (open: boolean) => void,
    roleDelete: { id: number, code: string } | undefined,
    setRoleDelete: ({ id, code }: { id: number, code: string }) => void,
    navigate: NavigateFunction
): ColumnsType<DataType> => [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            render: (permissions: string[]) => {
                return (
                    <Space wrap>
                        {permissions.map((permission, index) => {
                            if (index + 1 <= 4) {
                                return <Tag key={index}>{permission}</Tag>
                            }
                        })}
                        {
                            permissions.length > 4 && (
                                <Tooltip title={permissions.map((permission, index) => {
                                    if (index >= 4) {
                                        return permission
                                    }
                                }).filter(notUndefined => notUndefined !== undefined).join(', ')}>
                                    <Tag style={{ cursor: "pointer" }}>+{permissions.length - 4}</Tag>
                                </Tooltip>)
                        }
                    </Space>
                )
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                if (record.code === "superadmin") {
                    return null
                }
                return (
                    <Space size="middle">
                        <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`update/${record.id}`)} />
                        <Button shape="circle" icon={<DeleteOutlined />} onClick={() => {
                            setIsModalOpen(true)
                            setRoleDelete({
                                ...roleDelete,
                                id: record.id,
                                code: record.code
                            })
                        }} />
                    </Space>
                )
            },
        },
    ]

const RoleList = () => {
    // ** State
    const [take, setTake] = useState<number>(12)
    const [skip, setSkip] = useState<number>(0)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [roleDelete, setRoleDelete] = useState<{ id: number, code: string }>()
    const [refresh, setRefresh] = useState({})

    // ** Third party
    const navigate = useNavigate()

    // ** Variables
    const store = useAppSelector((state) => state.role);
    const dispatch = useAppDispatch();
    const axiosClient = createAxiosClient();

    // ** Effect
    useEffect(() => {
        getListRole({
            pagination: {
                skip,
                take
            },
            axiosClient,
            dispatch,
        })
    }, [skip, take, refresh])

    // ** Function handle
    const dataRender = (): DataType[] => {
        if (!store.list.loading && store.list.result) {
            return store.list.result.roles.map((role, index: number) => {
                return {
                    key: index,
                    id: role.id,
                    description: role.description,
                    code: role.code,
                    permissions: role.permissions,
                }
            })
        }
        return []
    }

    const handleOk = async () => {
        await deleteRole({
            axiosClient,
            dispatch,
            id: roleDelete?.id!
        })
        if (store.delete.error) {
            setTimeout(function () {
                setIsModalOpen(false)
            }, 1000)
        } else {
            setTimeout(function () {
                message.success('Delete role successfully!');
                setIsModalOpen(false)
                setRefresh({})
            }, 1000)
        }
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
                            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                <Button
                                    style={{ textTransform: "uppercase" }}
                                    type="primary"
                                    onClick={() => navigate('create')}
                                    icon={<PlusCircleOutlined />}
                                >
                                    Create new role
                                </Button>
                            </div>
                        </Col>
                        <Divider />
                        <Col span={24}>
                            <Card>
                                <Table bordered columns={columns(setIsModalOpen, roleDelete, setRoleDelete, navigate)} dataSource={dataRender()} loading={store.list.loading} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Modal title="Delete role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={store.delete.loading}>
                <p>Do you want to delete this role (<span style={{ fontWeight: "bold" }}>{roleDelete?.code}</span>) ?</p>
            </Modal>
        </Fragment>
    );
};

export default RoleList;