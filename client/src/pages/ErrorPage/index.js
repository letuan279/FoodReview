import { Row, Image, Button, Col } from 'antd'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const ErrorPage = () => {

    const navigate = useNavigate()

    return (
        <Row type='flex' justify='center' align='middle' style={{ minHeight: '100vh' }}>
            <Col>
                <Row type='flex' justify='center' align='middle'>
                    <Image
                        preview={false}
                        width={650}
                        src="https://img.freepik.com/free-vector/404-error-with-landscape-concept-illustration_114360-7898.jpg?w=2000"
                    />
                </Row>
                <Row type='flex' justify='center' align='middle'>
                    <Button onClick={() => navigate(-1)}>
                        Back!
                    </Button>
                </Row>
            </Col >
        </Row >

    )
}

export default ErrorPage