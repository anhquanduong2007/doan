import { Box, useToast } from '@chakra-ui/react';
import { Button, Card, Modal, Popover, Tooltip, message } from 'antd';
import React, { Fragment, useState } from 'react';
import {
    InboxOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { deleteAddress, setDefaultShippingAddressAction } from 'src/features/address/action';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { UserAddress } from 'src/shared/types';

interface AddressesProps {
    address: UserAddress
    setRefresh: (refresh: boolean) => void,
    refresh: boolean,
    setUpdateAddress: (addressId: number) => void
    setMode: (mode: boolean) => void
    setAddressModal: (open: boolean) => void,
}

const AddressItem = ({ address, refresh, setRefresh, setMode, setUpdateAddress, setAddressModal }: AddressesProps) => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [addressDelete, setAddressDelete] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);
    const [addressId, setAddressId] = useState<number>()

    // ** Third party
    const toast = useToast()

    // ** Variables
    const store = useAppSelector((state) => state.address);
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const axiosClientJwt = createAxiosJwt();

    // ** Function handle
    const showModal = (id: number) => {
        setIsModalOpen(true);
        setAddressDelete(id)
        setOpen(false)
    };

    const handleOk = () => {
        deleteAddress({
            axiosClientJwt,
            dispatch,
            id: +(addressDelete as number),
            refresh,
            setIsModalOpen,
            toast,
            setRefresh,
        })
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const setDefaultShippingAddress = (updateAddress: number) => {
        setDefaultShippingAddressAction({
            axiosClientJwt,
            customer_id: !auth.login.loading && auth.login.result ? auth.login.result.id : 0,
            dispatch,
            id: +updateAddress,
            message,
            toast,
            refresh,
            setRefresh
        })
    }

    return (
        <Fragment>
            <Card
                title={
                    <Tooltip title={`${address.street_line_1}, ${address.city}`}>
                        <div style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {`${address.street_line_1}, ${address.city}`}
                        </div>
                    </Tooltip>
                }
                loading={store.update.loading && addressId === address.id ||
                    store.delete.loading && addressDelete === address.id ||
                    store.setDefaultShipping.loading && addressId === address.id
                }
                extra={
                    <Popover content={
                        <Fragment>
                            <Box
                                as="p"
                                cursor={"pointer"}
                                onClick={() => {
                                    showModal(address.id)
                                }}
                            >
                                Xóa địa chỉ
                            </Box>
                            <Box as="p" cursor={"pointer"} onClick={() => {
                                setUpdateAddress(address.id)
                                setAddressId(address.id)
                                setOpen(false)
                                setAddressModal(true)
                                setMode(true)
                            }}
                            >
                                Chỉnh sửa địa chỉ
                            </Box>
                            <Box
                                as="p"
                                cursor={"pointer"}
                                style={{ pointerEvents: address.default_shipping_address ? 'none' : 'unset' }}
                                opacity={address.default_shipping_address ? 0.5 : 1}
                                onClick={() => {
                                    setDefaultShippingAddress(address.id)
                                    setAddressId(address.id)
                                }}
                            >
                                Đặt làm mặc định
                            </Box>
                        </Fragment>
                    }
                        trigger="click"
                        placement="bottom"
                        title="Action"
                        open={open}
                        onOpenChange={(open: boolean) => setOpen(open)}
                    >
                        <EllipsisOutlined />
                    </Popover>
                } style={{ flex: 1 }}>
                {
                    address.default_shipping_address && (
                        <p>
                            <Button disabled icon={<InboxOutlined />}>Địa chỉ mặc định</Button>
                        </p>
                    )
                }
                <Tooltip title={`Tuyến phố 1: ${address.street_line_1}`}>
                    <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box as="span" fontWeight="semibold">Tuyến phố 1: </Box>{address.street_line_1}
                    </p>
                </Tooltip>
                <Tooltip title={`Tuyến phố 2: ${address.street_line_2 ? address.street_line_2 : '-'}`}>
                    <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box as="span" fontWeight="semibold">Tuyến phố 2: </Box>{address.street_line_2 ? address.street_line_2 : '-'}
                    </p>
                </Tooltip>
                <Tooltip title={`Thành phố: ${address.city}`}>
                    <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box as="span" fontWeight="semibold">Thành phố: </Box>{address.city}
                    </p>
                </Tooltip>
                <Tooltip title={`Quốc gia:: ${address.country}`}>
                    <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box as="span" fontWeight="semibold">Quốc gia: </Box>{address.country}
                    </p>
                </Tooltip>
                <Tooltip title={`Mã bưu điện: ${address.postal_code}`}>
                    <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box as="span" fontWeight="semibold">Mã bưu điện: </Box>{address.postal_code}
                    </p>
                </Tooltip>
                <Tooltip title={`Tỉnh: ${address.province}`}>
                    <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        <Box as="span" fontWeight="semibold">Tỉnh: </Box>{address.province}
                    </p>
                </Tooltip>
            </Card>
            <Modal title="Xóa địa chỉ" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered confirmLoading={store.delete.loading}>
                <p>Bạn có chắc muốn xóa địa chỉ này?</p>
            </Modal>
        </Fragment>
    );
};

export default AddressItem;