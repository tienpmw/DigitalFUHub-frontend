import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Button, Card, Col, DatePicker, Form, Input, Typography, Row, Select, Space, Rate, Image, Pagination, Empty, Tooltip } from "antd";
import Spinning from "~/components/Spinning";
import { ParseDateTime, getUserId } from "~/utils";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { getListFeedbackSeller } from "~/api/feedback";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

const { Title, Text, Paragraph } = Typography
function Feedbacks() {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const [formSearch] = Form.useForm();
    const [listFeedback, setListFeedback] = useState([]);
    const [searchData, setSearchData] = useState({
        orderId: '',
        username: '',
        userId: getUserId(),
        fromDate: null,
        rate: 0
    });
    const initFormValues = [
        {
            name: 'orderId',
            value: searchData.orderId,
        },
        {
            name: 'username',
            value: searchData.username,
        },
        {
            name: 'fromDate',
            value: searchData.fromDate === null ? null : dayjs(searchData.fromDate, 'M/D/YYYY')
        },
        {
            name: 'rate',
            value: searchData.rate,
        },
    ];
    useEffect(() => {
        setLoading(true);
        getListFeedbackSeller(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setPage(1)
                    setListFeedback(res.data.result);
                }
                setLoading(false);
            })
            .catch((err) => { setLoading(false); })
    }, [searchData])
    const onFinishSearch = (values) => {
        setSearchData({
            username: !values.username ? "" : values.username.trim(),
            orderId: !values.orderId ? "" : values.orderId.trim(),
            userId: getUserId(),
            fromDate: values.fromDate ? values.fromDate.$d.toLocaleDateString() : null,
            rate: values.rate
        });

    }
    const handleSelectPage = (page) => {
        setLoading(true);
        setPage(page);
        setLoading(false);
    }
    return (<>
        <Spinning spinning={loading}>
            <Card
                style={{
                    width: '100%',
                    minHeight: "690px"
                }}
                title="Danh sách đánh giá"
            >
                <Form
                    form={formSearch}
                    onFinish={onFinishSearch}
                    fields={initFormValues}
                >
                    <Row>
                        <Col span={3} offset={1}><label>Mã đơn:  </label></Col>
                        <Col span={6}>
                            <Form.Item name="orderId" >
                                <Input placeholder="Mã đơn hàng" />
                            </Form.Item>
                        </Col>
                        <Col span={3} offset={1}><label>Người dùng:  </label></Col>
                        <Col span={6} style={{ marginLeft: '-1.6em' }}>
                            <Form.Item name="username" >
                                <Input placeholder="Tên đăng nhập" />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={3} offset={1}><label>Thời gian đánh giá: </label></Col>
                        <Col span={6}>
                            <Form.Item name="fromDate" >
                                <DatePicker locale={locale}
                                    style={{ width: '100%' }}
                                    format={"M/D/YYYY"}
                                    placement={"bottomLeft"} />
                            </Form.Item>
                        </Col>
                        <Col span={3} offset={1}><label>Điểm đánh giá: </label></Col>
                        <Col span={6} style={{ marginLeft: '-1.6em' }}>
                            <Form.Item name="rate" >
                                <Select >
                                    <Select.Option value={0}>Tất cả</Select.Option>
                                    <Select.Option value={5}><Rate value={5} disabled style={{ fontSize: 14, cursor: 'pointer' }} /></Select.Option>
                                    <Select.Option value={4}><Rate value={4} disabled style={{ fontSize: 14, cursor: 'pointer' }} /></Select.Option>
                                    <Select.Option value={3}><Rate value={3} disabled style={{ fontSize: 14, cursor: 'pointer' }} /></Select.Option>
                                    <Select.Option value={2}><Rate value={2} disabled style={{ fontSize: 14, cursor: 'pointer' }} /></Select.Option>
                                    <Select.Option value={1}><Rate value={1} disabled style={{ fontSize: 14, cursor: 'pointer' }} /></Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col offset={1}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                    <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                    </Form.Item>
                </Form>

                <Row gutter={[0, 16]}>
                    <Card.Grid style={
                        {
                            width: '100%',
                            paddingTop: '10px',
                            paddingBottom: '2px',
                            background: '#fafafa',
                            borderTopLeftRadius: '6px',
                            borderTopRightRadius: '6px'
                        }
                    }
                        hoverable={false}>
                        <Col span={24}>
                            <Row>
                                <Col span={8}><Title level={5}>Tên sản phẩm</Title></Col>
                                <Col ><Title level={5}>Người mua đánh giá</Title></Col>
                            </Row>
                        </Col>
                    </Card.Grid>
                    {listFeedback.length <= 0 ?
                        <Card.Grid style={{ width: '100%' }} hoverable={false} ><Empty /></Card.Grid>
                        :
                        listFeedback.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize).map((v, i) => (
                            <Card.Grid style={{ width: '100%' }} key={i}>
                                <Col span={24}>
                                    <Row >
                                        <Col span={24}>
                                            <Row gutter={[0, 8]} style={{ marginBottom: '0.5em' }}>
                                                <Col span={8}>
                                                    <Text>Mã đơn hàng: {v.orderId}</Text>
                                                </Col>
                                                <Col span={16}>
                                                    <Text>Người mua: {v.customerUsername}</Text>
                                                </Col>
                                            </Row>
                                            <Row gutter={[0, 16]}>
                                                {v?.detail?.map((value, index) => (
                                                    <Col span={24}>
                                                        <Row wrap key={index}>
                                                            <Col span={2}>
                                                                <Image
                                                                    width={80}
                                                                    src={value.thumbnail}
                                                                    preview={{
                                                                        movable: false,
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col span={6}>
                                                                <Row gutter={8}>
                                                                    <Col span={24}>
                                                                        {
                                                                            value.productName.length > 38 ?
                                                                                <Tooltip title={value.productName}>
                                                                                    <Text>{value.productName.slice(0, 38)}...</Text>
                                                                                </Tooltip>
                                                                                :
                                                                                <Text>{value.productName}</Text>
                                                                        }
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <Text>Phân loại: {value.productVariantName}</Text>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Col span={16}>
                                                                <Row gutter={8}>
                                                                    <Col span={24}>
                                                                        <Rate value={value.rate} style={{ fontSize: 13 }} disabled />
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <Paragraph style={{ fontSize: 16, marginBottom: 0 }}>{value.content}</Paragraph>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <Row gutter={8}>
                                                                            {value?.urlImageFeedback.map((url, i) =>
                                                                                <Col key={i}>
                                                                                    <Image
                                                                                        width={90}
                                                                                        src={url}
                                                                                        preview={{
                                                                                            movable: false,
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            )}
                                                                        </Row>
                                                                    </Col>
                                                                    <Col span={24}>
                                                                        <Text>{ParseDateTime(value.feedbackDate)}</Text>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Card.Grid>
                        ))
                    }
                </Row>
                <Row justify="end" style={{ marginTop: '2em' }}>
                    <Pagination onChange={handleSelectPage} hideOnSinglePage current={page} total={listFeedback.length} pageSize={pageSize} />
                </Row>
            </Card>
        </Spinning>
    </>);
}

export default Feedbacks;