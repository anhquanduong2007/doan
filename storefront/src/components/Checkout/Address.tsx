import { Box, Card, useToast } from '@chakra-ui/react';
import React, { useState, useEffect, Fragment } from 'react';
import { Divider } from 'antd'
import { createAxiosJwt } from 'src/axios/axiosInstance';
import { useAppDispatch, useAppSelector } from 'src/app/hooks';
import { Card as CardAntd, Tooltip, Popover, Button, Modal, Row, Col } from 'antd'
import { Asset, UserAddress } from 'src/shared/types';
import {
    InboxOutlined,
    EllipsisOutlined
} from '@ant-design/icons';
import { getMe } from 'src/features/auth/action';
import AddressItem from './AddressItem';
import AddressModal from './AddressModal';
interface AddressProps {
    address: UserAddress
    setAddress: (address: UserAddress) => void
}

const Address = ({ address, setAddress }: AddressProps) => {
    // ** State
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [addressDelete, setAddressDelete] = useState<number>();
    const [open, setOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false)
    const [addressModal, setAddressModal] = useState<boolean>(false)
    const [mode, setMode] = useState<boolean>(false)
    const [updateAddress, setUpdateAddress] = useState<number>()

    // ** Variables
    const axiosClientJwt = createAxiosJwt();
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth)

    // ** Third party
    const toast = useToast()

    // ** Effect
    useEffect(() => {
        getMe({
            axiosClientJwt,
            dispatch,
            toast
        })
    }, [refresh])

    useEffect(() => {
        if (!auth.me.loading && auth.me.result) {
            setAddress(auth.me.result.address?.find((ad) => ad.default_shipping_address === true) as UserAddress)
        }
    }, [auth.me.loading, auth.me.result])

    return (
        <div className='mb-[1rem]'>
            <Card variant="outline" padding={8}>
                <div className='text-center font-bold'>Địa chỉ</div>
                <Divider />
                {
                    address ? (
                        <CardAntd title={
                            <Tooltip title={`${address.street_line_1}, ${address.city}`}>
                                <div style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {`${address.street_line_1}, ${address.city}`}
                                </div>
                            </Tooltip>
                        } extra={
                            <Popover content={
                                <Fragment>
                                    <Box
                                        as="p"
                                        cursor={"pointer"}
                                        onClick={() => {
                                            setUpdateAddress(address.id)
                                            setOpen(false)
                                            setAddressModal(true)
                                            setMode(true)
                                        }}
                                    >
                                        Sửa địa chỉ
                                    </Box>
                                    <Box
                                        as="p"
                                        cursor={"pointer"}
                                        onClick={() => {
                                            setIsModalOpen(true)
                                            setOpen(false)
                                        }}
                                    >
                                        Chọn địa chỉ khác
                                    </Box>
                                </Fragment>
                            } trigger="click" placement="bottom" title="Hành động" open={open} onOpenChange={(open: boolean) => setOpen(open)}>
                                <EllipsisOutlined />
                            </Popover>
                        } style={{ flex: 1 }}>
                            <Tooltip title={`Street line 1: ${address.street_line_1}`}>
                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Box as="span" fontWeight="semibold">Tuyến phố 1 1: </Box>{address.street_line_1}
                                </p>
                            </Tooltip>
                            <Tooltip title={`Street line 2: ${address.street_line_2 ? address.street_line_2 : '-'}`}>
                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Box as="span" fontWeight="semibold">Tuyến phố 2: </Box>{address.street_line_2 ? address.street_line_2 : '-'}
                                </p>
                            </Tooltip>
                            <Tooltip title={`City: ${address.city}`}>
                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Box as="span" fontWeight="semibold">Thành phố: </Box>{address.city}
                                </p>
                            </Tooltip>
                            <Tooltip title={`Country: ${address.country}`}>
                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Box as="span" fontWeight="semibold">Quốc gia: </Box>{address.country}
                                </p>
                            </Tooltip>
                            <Tooltip title={`Postal code: ${address.postal_code}`}>
                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Box as="span" fontWeight="semibold">Mã bưu điện: </Box>{address.postal_code}
                                </p>
                            </Tooltip>
                            <Tooltip title={`Province: ${address.province}`}>
                                <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Box as="span" fontWeight="semibold">Tỉnh: </Box>{address.province}
                                </p>
                            </Tooltip>
                        </CardAntd>
                    ) : <Button onClick={() => { setIsModalOpen(true) }}>Chọn hoặc tạo địa chỉ</Button>
                }
            </Card>
            <Modal title="Address" open={isModalOpen} onOk={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} centered width={"80%"}>
                <Row gutter={[12, 12]}>
                    <Col span={24}>
                        <Button
                            type="primary"
                            onClick={() => {
                                setAddressModal(true)
                                setMode(false)
                            }}
                        >
                            Tạo địa chỉ
                        </Button>
                    </Col>
                    {
                        !auth.me.loading && auth.me.result && (
                            auth.me.result.address.map((address, index) => {
                                return (
                                    <Col span={8} style={{ display: "flex" }} key={index}>
                                        <AddressItem
                                            address={address}
                                            setRefresh={setRefresh}
                                            refresh={refresh}
                                            setUpdateAddress={setUpdateAddress}
                                            setMode={setMode}
                                            setAddressModal={setAddressModal}
                                        />
                                    </Col>
                                )
                            })
                        )
                    }
                </Row>
            </Modal>
            <AddressModal
                addressModal={addressModal}
                setAddressModal={setAddressModal}
                mode={mode}
                updateAddress={updateAddress as number}
                refresh={refresh}
                setRefresh={setRefresh}
            />
        </div>
    );
};

export default Address;