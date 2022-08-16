import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import NavBar from '../../components/Navbar'
import { Col, Row, Table, Avatar, Anchor } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import Post from '../../components/Post'
import Search from '../../components/Search'
import './index.scss'

const HomePage = () => {
    const { handleInfo, authState: { ranks, posts, images } } = useAppContext()
    const [postList, setPostList] = useState([])

    useEffect(() => {
        handleInfo()
    }, [])

    // console.log('ranks: ', ranks);
    // console.log("Post list", postList);


    const ranksData = []
    ranks.map((rank, index) => {
        ranksData[index] = {
            key: `${index}`,
            nickname: <div><Avatar size={40} src={`images/${rank.id % 5 + 1}.png`} /> {rank.nickname}</div>,
            numLike: rank.numLike
        }
    })
    const columns = [
        {
            title: 'Ranker',
            dataIndex: 'nickname',
            key: 'nickname'
        },
        {
            title: 'Likes',
            dataIndex: 'numLike',
            key: 'numLike'
        }
    ]

    return (<>
        <Anchor offsetTop={0}>
            <NavBar />
        </Anchor>
        <Row style={{ minHeight: '500px', padding: '0 20px' }}>
            <Col span={6} >
                <Anchor offsetTop={150}>
                    <Search setPostList={setPostList} posts={posts} />
                </Anchor>
            </Col>

            <Col span={12} >
                {postList.length === 0 && posts.map((post, index) => (
                    <Post page='home' key={index} data={post} images={images.filter((item) => item.post_id === post.post_id)} />
                ))}
                {postList.length !== 0 && posts.map((post, index) => {
                    if (postList.includes(post.post_id)) {
                        return (
                            <Post page='home' key={index} data={post} images={images.filter((item) => item.post_id === post.post_id)} />
                        )
                    }
                    return <></>
                })}
            </Col>

            <Col span={6} >
                <Anchor offsetTop={150}>
                    <Table className='ranks' style={{ padding: '0 12px' }} pagination={false} dataSource={ranksData} columns={columns} />
                </Anchor>
            </Col>
        </Row>
    </>
    )

}

export default HomePage