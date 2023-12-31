import { Col, Row, Space } from 'antd';
import { Link } from 'react-router-dom';
import notFound from '~/assets/images/notFound.png'

function SearchNotFound() {
    return (<>
        <Row justify="center">
            <Col>
                <Space align="center" direction="vertical" style={{ width: '100%', height: '100%' }}>
                    <img src={notFound} alt="" style={{ width: '8.375rem' }} />
                    <div style={{
                        color: 'rgba(0, 0, 0, .87)',
                        fontSize: '1.125rem'
                    }}>Không tìm thấy kết quả nào</div>
                    <div>
                        <Link to={"/"}><div>Trở về trang chủ</div></Link>
                    </div>
                </Space>
            </Col>
        </Row>
    </>);
}

export default SearchNotFound;