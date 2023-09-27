import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, notification, Select } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';

import { useAuthUser } from 'react-auth-kit'

import { getDepositTransaction } from '~/api/bank'
import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import dayjs from 'dayjs';
import { RESPONSE_CODE_SUCCESS } from "~/constants";

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã hóa đơn',
        dataIndex: 'depositTransactionId',
        width: '10%',
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
        width: '15%',
        render: (requestDate) => {
            return (
                <p>{ParseDateTime(requestDate)}</p>
            )
        }
    },
    {
        title: 'Thời gian chuyển khoản',
        dataIndex: 'paidDate',
        width: '15%',
        render: (paidDate, record) => {
            return (
                record.isPay ?
                    <p>{ParseDateTime(paidDate)}</p>
                    :
                    <p>TBD</p>
            )
        }
    },
    {
        title: 'Nội dung chuyển khoản',
        dataIndex: 'code',
        width: '15%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isPay',
        width: '15%',
        render: (paidDate, record) => {
            return (
                record.isPay ?
                    <Tag color="#52c41a">Thành công</Tag>
                    :
                    <Tag color="##ec0b0b">Đang chờ chuyển khoản</Tag>
            )
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
        depositTransactionId: '',
        fromRequestDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toRequestDate: dayjs().format('M/D/YYYY'),
        fromPaidDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toPaidDate: dayjs().format('M/D/YYYY'),
        status: 0
    });
    const [disablePaidDateSelect, setDisablePaidDateSelect] = useState(true)
    const [selectedStatus, setSelectedStatus] = useState(0)



    useEffect(() => {
        getDepositTransaction(user.id, searchData)
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
    }, [])

    const initFormValues = [
        {
            name: 'depositTransactionId',
            value: searchData.depositTransactionId,
        },
        {
            name: 'requestDate',
            value: [dayjs(searchData.fromPaidDate, 'M/D/YYYY'), dayjs(searchData.toPaidDate, 'M/D/YYYY')]
        },
        {
            name: 'paidDate',
            value: [dayjs(searchData.fromPaidDate, 'M/D/YYYY'), dayjs(searchData.toPaidDate, 'M/D/YYYY')]
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.requestDate === null) {
            openNotification("error", "Thời gian chuyển khoản không được trống!")
            setLoading(false);
            return;
        }
        if (selectedStatus === 1) {

        }
        setDataTable([])
        setSearchData({
            depositTransactionId: values.depositTransactionId,
            fromRequestDate: values.requestDate[0].$d.toLocaleDateString(),
            toRequestDate: values.requestDate[1].$d.toLocaleDateString(),
            fromPaidDate: values.paidDate[0].$d.toLocaleDateString(),
            toPaidDate: values.paidDate[1].$d.toLocaleDateString(),
            status: values.status
        });
        getDepositTransaction(user.id, searchData)
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

    };

    const handleSelectStatus = (value) => {
        if (value === 1) {
            setDisablePaidDateSelect(false)
        } else {
            setDisablePaidDateSelect(true);
        }
        setSelectedStatus(value)
    }


    return (
        <>
            {contextHolder}
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        marginBottom: 15
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
                        <Form.Item label="Mã hóa đơn" labelAlign="left" name="depositTransactionId">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Thời gian tạo yêu cầu" labelAlign="left" name="requestDate">
                            <RangePicker locale={locale}
                                format={"M/D/YYYY"}
                                placement={"bottomLeft"} />
                        </Form.Item>

                        <Form.Item label="Thời gian chuyển khoản" labelAlign="left" name="paidDate">
                            <RangePicker locale={locale}
                                format={"M/D/YYYY"}
                                placement={"bottomLeft"}
                                disabled={disablePaidDateSelect}
                            />
                        </Form.Item>

                        <Form.Item label="Trạng thái" labelAlign="left" name="status">
                            <Select onChange={(value) => { handleSelectStatus(value) }} defaultValue={selectedStatus}>
                                <Select.Option value={0}>Tất cả</Select.Option>
                                <Select.Option value={1}>Thành công</Select.Option>
                                <Select.Option value={2}>Đang chờ chuyển khoản</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ position: 'absolute', top: 60, left: 550 }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                    <Table columns={columns} pagination={{ size: 10 }} dataSource={dataTable} />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryWithdraw;