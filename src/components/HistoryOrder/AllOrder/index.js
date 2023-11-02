import { Avatar, Button, Col, Empty, Image, Modal, Rate, Row, Spin, Typography, Space } from "antd";
import CardOrderItem from "../CardOrderItem";
import { useContext, useEffect, useRef, useState } from "react";
import { ParseDateTime, getUserId } from "~/utils";
import { customerUpdateStatusOrder, getListOrdersCustomer } from "~/api/order";
import { ORDER_COMPLAINT, ORDER_CONFIRMED, RESPONSE_CODE_SUCCESS, RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE } from "~/constants";
import { NotificationContext } from "~/context/NotificationContext";
import { addFeedbackOrder, getFeedbackDetail } from "~/api/feedback";
import { Link } from "react-router-dom";
import logoFPT from '~/assets/images/fpt-logo.jpg'

const { Text, Title, Paragraph } = Typography;

function AllOrder({ status = 0, loading, setLoading }) {
    const notification = useContext(NotificationContext);
    const [paramSearch, setParamSearch] = useState({
        userId: getUserId(),
        limit: 5,
        offset: 0,
        statusId: status
    });
    const [orders, setOrders] = useState([]);
    const nextOffset = useRef(0)
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    useEffect(() => {
        if (nextOffset.current !== -1) {

            if (nextOffset.current !== 0) {
                setLoadingMoreData(true);
            }
            getListOrdersCustomer(paramSearch)
                .then(res => {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        setOrders([...orders, ...res.data.result.orders]);
                        nextOffset.current = res.data.result.nextOffset;
                    }
                })
                .catch(err => { })
            if (loading) {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout)
                }, 300)
            }
            setLoadingMoreData(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramSearch])

    useEffect(() => {
        const scrollHandle = () => {
            var scrollMaxY = window.scrollMaxY || (document.documentElement.scrollHeight - document.documentElement.clientHeight)
            if (scrollMaxY - window.scrollY <= 150) {
                if (nextOffset.current !== -1 && !loadingMoreData) {
                    setParamSearch({
                        ...paramSearch,
                        offset: nextOffset.current,
                    });
                }
            }
        }
        window.addEventListener("scroll", scrollHandle);
        return () => {
            window.removeEventListener("scroll", scrollHandle)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleOrderComplaint = (orderId, shopId) => {
        setOrders(prev => {
            const order = prev.find((value) => value.orderId === orderId);
            order.statusId = ORDER_COMPLAINT
            return [...prev]
        })
    }

    const handleOrderComplete = (orderId, shopId) => {
        // call api
        const dataBody = {
            userId: getUserId(),
            shopId: shopId,
            orderId: orderId,
            statusId: ORDER_CONFIRMED
        }
        customerUpdateStatusOrder(dataBody)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        const order = prev.find((value) => value.orderId === orderId);
                        order.statusId = dataBody.statusId
                        return [...prev]
                    })
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("info", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Đã có lỗi xảy ra.")
                }
            })
            .catch(err => { notification("error", "Đã có lỗi xảy ra.") })
    }

    const handleCustomerFeedback = (formData) => {
        const orderId = formData.get("orderId");
        const orderDetailId = formData.get("orderDetailId");
        addFeedbackOrder(formData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrders(prev => {
                        const order = prev.find((value) => value.orderId === parseInt(orderId));
                        const orderDetail = order.orderDetails.find((v) => v.orderDetailId === parseInt(orderDetailId))
                        orderDetail.isFeedback = true;
                        return [...prev];
                    })
                }
            })
            .catch((err) => {

            })
    }
    const [isModalViewFeedbackOpen, setIsModalViewFeedbackOpen] = useState(false);
    const [feedbackDetail, setFeedbackDetail] = useState([]);
    const showModalViewFeedback = () => {
        setIsModalViewFeedbackOpen(true);
    };
    const handleViewFeedbackOk = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleViewFeedbackCancel = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleCustomerViewFeedback = (orderId) => {
        getFeedbackDetail(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setFeedbackDetail(res.data.result);
                    showModalViewFeedback();
                }
            })
            .catch((err) => {
            })
    }
    return (<div >
        {!loading ?
            orders.length > 0 ?
                <>
                    <Row gutter={[0, 16]} style={{ padding: '0 50px' }}>
                        {orders.map((v, i) => {
                            return <Col span={24}>
                                <CardOrderItem key={v.orderId}
                                    orderId={v.orderId}
                                    note={v.note}
                                    orderDate={v.orderDate}
                                    shopId={v.shopId}
                                    shopName={v.shopName}
                                    statusId={v.statusId}
                                    conversationId={v.conversationId}
                                    totalAmount={v.totalAmount}
                                    totalCoinDiscount={v.totalCoinDiscount}
                                    totalCouponDiscount={v.totalCouponDiscount}
                                    totalPayment={v.totalPayment}
                                    orderDetails={v.orderDetails}
                                    onOrderComplete={() => handleOrderComplete(v.orderId, v.shopId)}
                                    onOrderComplaint={() => handleOrderComplaint(v.orderId, v.shopId)}
                                    onFeedback={handleCustomerFeedback}
                                    onViewFeedback={() => handleCustomerViewFeedback(v.orderId)}
                                />
                            </Col>
                        })}
                        <Col span={24}>
                            <Row justify="center" gutter={8}>
                                <Spin spinning={loadingMoreData}></Spin>
                            </Row>
                        </Col>
                    </Row>

                    <Modal title="Đánh giá cửa hàng" open={isModalViewFeedbackOpen} onOk={handleViewFeedbackOk} onCancel={handleViewFeedbackCancel}
                        footer={[
                            <Button key="close" onClick={handleViewFeedbackOk}>
                                Đóng
                            </Button>,
                        ]}
                    >
                        <Row gutter={[0, 16]}>
                            {feedbackDetail.map((v, i) => <>
                                <Col span={24} key={i}>
                                    <Row gutter={[8, 8]} wrap={false}>
                                        <Col flex={0}>
                                            <Link to={`/product/${v.productId}`}>
                                                <Image
                                                    preview={false}
                                                    width={60}
                                                    src={v.thumbnail}
                                                />
                                            </Link>
                                        </Col>
                                        <Col flex={5}>
                                            <Row>
                                                <Col span={23}><Title level={5}>{v.productName}</Title></Col>
                                                <Col span={23}><Text>{`Phân loại: ${v.productVariantName} x ${v.quantity}`}</Text></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={23} offset={1}>
                                    <Row gutter={[8, 8]} wrap={false}>
                                        <Col flex={0}>
                                            <Avatar size="large" src={v.avatar || logoFPT} />
                                        </Col>
                                        <Col flex={5} >
                                            <Row >
                                                <Col span={23}><Text>{v.username}</Text></Col>
                                                <Col span={23}><Rate value={v.rate} disabled style={{ fontSize: "14px" }} /></Col>
                                                <Col span={23}><Paragraph>{v.content}</Paragraph></Col>
                                                <Col span={23} >
                                                    <Row gutter={[8, 8]}>
                                                        {v?.urlImages?.map((url, i) => <Col>
                                                            <Image
                                                                width={80}
                                                                src={url}
                                                                preview={{
                                                                    movable: false,
                                                                }}
                                                            />
                                                        </Col>)}
                                                    </Row>
                                                </Col>
                                                <Col span={23}><Text>{ParseDateTime(v.date)}</Text></Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </>)}

                        </Row>
                    </Modal>
                </>
                :
                <Empty />
            :
            null
        }

    </div>);
}

export default AllOrder;