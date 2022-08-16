import { Button, Col, Row, Anchor } from 'antd'
import React, { useState } from 'react'
import NavBar from '../../components/Navbar'
import { useAppContext } from '../../context/AppContext'
import PostModal from '../../components/PostModal'
import Post from '../../components/Post'
import { useNavigate } from 'react-router-dom'
import { FileAddTwoTone } from '@ant-design/icons'


const MyPostPage = () => {
    const { authState: { myPosts, images } } = useAppContext()
    const [isCreate, setIsCreate] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isSelect, setIsSelect] = useState(null)
    const navigator = useNavigate()

    return (
        <>
            <Anchor offsetTop={0}>
                <NavBar />
            </Anchor>
            <Anchor offsetTop={150} >
                <div style={{ display: 'flex', justifyContent: 'left', alignContent: 'center', marginLeft: '10vw' }}>
                    <FileAddTwoTone style={{ fontSize: '36px', border: '2px solid cyan', padding: '10px', borderRadius: '50%' }} onClick={() => setIsCreate(true)}>Create</FileAddTwoTone>
                </div>
            </Anchor>
            {isCreate && <PostModal choice='create' setIsCreate={setIsCreate} setIsUpdate={setIsUpdate} />}
            {isUpdate && isSelect && <PostModal choice='update' setIsCreate={setIsCreate} setIsUpdate={setIsUpdate} post={isSelect} />}
            <Row style={{ minHeight: '500px' }}>
                <Col span={6}></Col>
                <Col span={12}>
                    {myPosts.map((post, index) => (
                        <Post setIsSelect={setIsSelect} update={() => setIsUpdate(true)} page='myPost' key={index} data={post} images={images.filter((item) => item.post_id === post.post_id)} />
                    ))}
                </Col>
                <Col span={6}></Col>
            </Row>
        </>
    )
}

export default MyPostPage