import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, Row, Col, Input } from "antd";
import { useAuthUser } from "react-auth-kit";

import { ExclamationCircleFilled } from "@ant-design/icons";

import {
    RESPONSE_CODE_SUCCESS,
    CUSTOMER_ROLE,
    SELLER_ROLE,
    ORDER_COMPLAINT,
    RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE
} from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";

import { customerUpdateStatusOrder } from '~/api/order'

const { TextArea } = Input;


function ModalChangeOrderStatusComplaint({ orderId, shopId, style, callBack }) {

    var auth = useAuthUser();
    var user = auth();
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [note, setNote] = useState("");
    useEffect(() => {
        if (user === null) return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = () => {
        setConfirmLoading(true)
        form.submit();
        var data = form.getFieldsValue()
        // init fields form
        setNote(data.note ? data.note : '')
        //
        if (data.note === undefined || data.note.trim() === "") {
            setConfirmLoading(false)
            return;
        }

        // // call api
        const dataBody = {
            userId: user.id,
            shopId: shopId,
            orderId: orderId,
            statusId: ORDER_COMPLAINT,
            note: data.note
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    callBack()
                    notification("success", "Đơn hàng được chuyển sang khiếu nại.")
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("error", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => {
                notification("error", "Đã có lỗi xảy ra.")
            })
            .finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false)
                }, 500)
            })
    }

    const handleOpenModal = () => {
        setOpenModal(true)
        //checking user has been linked bank account

    }

    const initFormValues = [
        {
            name: 'note',
            value: note
        },
    ];


    return (
        <>
            <Button danger onClick={handleOpenModal}
                type="primary"
                style={style}
                loading={confirmLoading}>
                Khiếu nại
            </Button>

            <Modal
                title={<div><ExclamationCircleFilled style={{ color: "#faad14" }} /> Bạn có chắc chắn muốn khiếu nại đơn hàng không?</div>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={confirmLoading}
                okText={"Xác nhận"}
                cancelText={"Hủy"}
                width={"35%"}
            >
                <>
                    {/* <Divider />
                    <b style={{ marginLeft: "20px" }}>
                        Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng là khiếu nại không?
                    </b> */}
                    <Form
                        name="basic"
                        form={form}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col offset={1} span={23}>
                                <Form.Item name="note" label={"Lý do"} required
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const data = !value ? "" : value.trim();
                                                if (!data) {
                                                    return Promise.reject(new Error('Lý do không được để trống.'));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <TextArea rows={4} placeholder="Nhập thông tin lý do chỉnh sửa trạng thái đơn hàng" maxLength={200} />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                        </Form.Item>
                    </Form>
                </>

            </Modal>
        </>)
}

export default ModalChangeOrderStatusComplaint;
