import { Spin, Row, Col } from "antd"
import { Outlet, Navigate } from "react-router-dom"
import { useAppContext } from "../../context/AppContext"

const RequireAuth = () => {
    // console.log("RequireAuth");
    const { authState: { isLoading, isAuthenticated }, } = useAppContext()

    if (isLoading) {
        return (
            <Row type='flex' justify='center' align='middle' style={{ minHeight: '100vh' }}>
                <Col>
                    <Spin tip="Loading..." size={"large"}></Spin>
                </Col>
            </Row>
        )
    }

    return (
        <>
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <Navigate to='/' />
            )}
        </>
    )
}

export default RequireAuth
