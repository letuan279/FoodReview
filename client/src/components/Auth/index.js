import { useAppContext } from "../../context/AppContext"
import { Spin, Row, Col } from "antd"
import { Outlet, Navigate } from "react-router-dom"

const Auth = () => {
    // console.log("Auth");

    const { authState: { isLoading, isAuthenticated } } = useAppContext()
    let body

    if (isLoading) {
        body = (
            <Row type='flex' justify='center' align='middle' style={{ minHeight: '100vh' }}>
                <Col>
                    <Spin tip="Loading..." size={"large"}></Spin>
                </Col>
            </Row>
        )
    } else if (!isAuthenticated) {
        body = (
            <Outlet />
        )
    } else {
        body = <Navigate to='/home' />
    }


    return (
        <>
            {body}
        </>
    )
}

export default Auth