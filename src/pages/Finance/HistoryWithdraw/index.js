import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, notification, Select } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { useAuthUser } from 'react-auth-kit'

import { getWithdrawTransaction } from '~/api/bank'
import Spinning from "~/components/Spinning";
import ModalRequestWithdraw from "~/components/Modals/ModalRequestWithdraw";
import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    WITHDRAW_TRANSACTION_IN_PROCESSING,
    WITHDRAW_TRANSACTION_PAID,
    WITHDRAW_TRANSACTION_REJECT,
} from "~/constants";
import DrawerWithdrawTransactionBill from "~/components/Drawers/DrawerWithdrawTransactionBill";

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã giao dịch',
        dataIndex: 'withdrawTransactionId',
        width: '5%',
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        width: '15%',
        render: (amount) => {
            return (
                <p>{formatStringToCurrencyVND(amount)} VND</p>
            )
        }
    },
    {
        title: 'Thời gian tạo yêu cầu',
        dataIndex: 'requestDate',
        width: '16%',
        render: (requestDate) => {
            return (
                <p>{ParseDateTime(requestDate)}</p>
            )
        }
    },
    {
        title: 'Đơn vị thụ hưởng',
        dataIndex: 'creditAccountName',
        width: '20%',
    },
    {
        title: 'Số tài khoản',
        dataIndex: 'creditAccount',
        width: '15%',
    },
    {
        title: 'Ngân hàng đối tác',
        dataIndex: 'bankName',
        width: '15%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'withdrawTransactionStatusId',
        width: '7%',
        render: (withdrawTransactionStatusId, record) => {
            if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_IN_PROCESSING) {
                return <Tag color="#ecc30b">Đang xử lý yêu cầu</Tag>
            } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID) {
                return <Tag color="#52c41a">Thành công</Tag>
            } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                return <Tag color="red">Từ chối</Tag>
            }
        }
    },
    {
        title: '',
        dataIndex: 'withdrawTransactionStatusId',
        width: '5%',
        render: (withdrawTransactionStatusId, record) => {
            if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID ||
                withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                return <DrawerWithdrawTransactionBill userId={record.userId} withdrawTransactionId={record.withdrawTransactionId} />
            } else {
                return ""
            }

        }
    },

];

function HistoryWithdraw() {
    const auth = useAuthUser()
    const user = auth();
    const [loading, setLoading] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        withdrawTransactionId: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getWithdrawTransaction(user.id, searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else {
                    openNotification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const initFormValues = [
        {
            name: 'withdrawTransactionId',
            value: searchData.withdrawTransactionId,
        },
        {
            name: 'date',
            value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
        },
        {
            name: 'status',
            value: searchData.status
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            openNotification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            withdrawTransactionId: values.withdrawTransactionId,
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
            status: values.status
        });
    };

    const handleSearchDataTable = () => {
        setLoading(true);
        getWithdrawTransaction(user.id, searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else {
                    openNotification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }



    return (
        <>
            {contextHolder}
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        marginBottom: 15,
                        minHeight: "600px"
                    }}
                    hoverable
                >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 0,
                        }}
                        style={{
                            maxWidth: 500,
                            marginLeft: "30px",
                            position: 'relative',
                        }}
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Form.Item label="Mã giao dịch" labelAlign="left" name="withdrawTransactionId">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Thời gian tạo yêu cầu" labelAlign="left" name="date">
                            <RangePicker locale={locale}
                                format={"M/D/YYYY"}
                                placement={"bottomLeft"} />
                        </Form.Item>

                        <Form.Item label="Trạng thái" labelAlign="left" name="status">
                            <Select >
                                <Select.Option value={0}>Tất cả</Select.Option>
                                <Select.Option value={1}>Đang xử lý yêu cầu</Select.Option>
                                <Select.Option value={2}>Thành công</Select.Option>
                                <Select.Option value={3}>Từ chối</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ position: 'absolute', top: 110, left: 550 }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                    <ModalRequestWithdraw userId={user.id} callBack={() => handleSearchDataTable()} style={{ marginBottom: "5px" }} />

                    <Table columns={columns} pagination={{ pageSize: 5 }} dataSource={dataTable} />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryWithdraw;