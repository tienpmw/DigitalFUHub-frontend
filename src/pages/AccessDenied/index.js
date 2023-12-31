import { Button, Result } from "antd";
import { Link } from "react-router-dom";

function AccessDenied() {
    return (<><Result
        status="warning"
        title="Không có quyền truy cập"
        extra={
            <Link to={"/home"}>
                <Button type="primary" >
                    Trở về trang chủ
                </Button>
            </Link>
        }
    /></>);
}

export default AccessDenied;
