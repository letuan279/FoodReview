import { useState, useEffect } from 'react';
import { LikeOutlined, DashOutlined, EditOutlined, DeleteOutlined, CaretDownOutlined, CommentOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Row, Col, Image, message, Menu, Dropdown, Space, Rate, Collapse, Avatar, Input } from 'antd';
import './index.css'
import axios from '../../api/axios';
import { useAppContext } from '../../context/AppContext';
import moment from 'moment';


const Post = ({ data, page, update, setIsSelect }) => {
    const { handleAddMyPost, handleLikePost, increaseNumComment, authState: { user } } = useAppContext()
    const [visible, setVisible] = useState(false);
    const [commentInput, setCommentInput] = useState({
        toggle: false,
        content: ""
    })
    const [commentList, setCommentList] = useState([])
    const { address, description, liked, nickname, numComment, numLike, star, time_begin, time_end, id, user_id, updated_at } = data
    const [like, setLike] = useState(liked)
    const [numLikeComment, setNumLikeComment] = useState({
        numLike: numLike,
        numComment: numComment,
    })

    const likePost = async () => {
        handleLikePost(id)
        if(like == '1'){
            setNumLikeComment({
                ...numLikeComment,
                numLike: numLikeComment.numLike - 1
            })
            setLike('0')
        }else {
            setNumLikeComment({
                ...numLikeComment,
                numLike: numLikeComment.numLike + 1
            })
            setLike('1')
        }
    }

    const handleComment = async () => {
        try {
            const res = await axios.post(`/add-comment/${id}`, { content: commentInput.content })
            const resComment = await axios.get(`/comments/${id}`)
            setCommentList(resComment.data.comments)
            setNumLikeComment({
                ...numLikeComment,
                numComment: numLikeComment.numComment + 1
            })

        } catch (error) {
            message.error(error.message)
        }
        setCommentInput({ ...commentInput, content: '' })
    }

    const handleGetComment = async () => {
        if (commentInput.toggle === true) {
            setCommentInput({ ...commentInput, toggle: false })
            return
        }
        setCommentInput({ ...commentInput, toggle: true })
        try {
            const res = await axios.get(`/comments/${id}`)
            setCommentList(res.data.comments)
        } catch (error) {
            message.error(error.message)
        }
    }

    const handleLikeComment = async (comment_id) => {
        try {
            const res = await axios.get(`/like-comment/${comment_id}`)
            console.log("data", res.data);
            console.log("comment list", commentList);
            setCommentList(commentList.map((item) => {
                if (item.id === comment_id) {
                    return {
                        ...item,
                        Liked: item.Liked == '0' ? '1' : '0',
                        numLike: res.data.result
                    }
                }
                return item
            }))
        } catch (error) {
            message.error(error.message)
        }
    }

    const handleDelete = async () => {
        try {
            const res = await axios.get(`/delete-post/${id}`)
            const resData = res.data
            message.success(resData.message)
            handleAddMyPost()
        } catch (error) {
            message.error(error.message)
        }
    }

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Button className='btn' onClick={() => {
                            setIsSelect({ description, address, time_begin, time_end, star, images: null, id })
                            update()
                        }}><EditOutlined /></Button>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <Button className='btn' onClick={handleDelete}><DeleteOutlined /></Button>
                    ),
                },
            ]}
        />
    );

    return (
        <div className="post" style={{ padding: '10px' }}>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Avatar size={50} src={`/images/${user_id % 5 + 1}.png`} />
                        <div style={{ display: 'grid' }}>
                            <span className="postUsername" style={{ fontSize: '18px', fontWeight: 'bold' }} >{nickname}</span>
                            <div style={{ marginLeft: '10px', fontStyle: 'italic' }}>{moment(updated_at).fromNow()}</div>
                        </div>
                    </div>
                    <div className="postTopRight">
                        {page === 'home' &&
                            <div className='postContact' style={{ display: 'flex', justifyContent: 'right', padding: '10px 0 4px' }}>
                                <span>🏠<i> {address}</i></span>
                            </div>
                        }
                        {page === 'myPost' &&
                            <Space direction="vertical">
                                <Space wrap>
                                    <Dropdown overlay={menu} placement="bottomLeft">
                                        <Button className='btn'><CaretDownOutlined /></Button>
                                    </Dropdown>
                                </Space>
                            </Space>
                        }
                    </div>
                </div>
                <div className="postCenter">
                    <span style={{ fontWeight: 'bold', fontSize: 16, display: 'grid', justifyContent: 'right' }}>
                        <span>⏰<i>{moment(time_begin).format('HH:MM') + " - " + moment(time_end).format('HH:MM')}</i></span>
                        <Rate style={{ display: 'flex', justifyContent: 'right' }} disabled value={star} />
                    </span>
                    <div className="postText">{description}</div>
                    <div style={{ display: 'grid', justifyContent: 'center', alignContent: 'center' }}>
                        <Image
                            className='postImg'
                            src={`http://localhost:3000/${data.picture.url}`}
                            alt="Not thing"
                            onClick={() => setVisible(true)}
                            style={{ maxHeight: 500, maxWidth: 800, display: 'flex' }}
                        />
                    </div>

                </div>
                <Row className="postBottom" style={{ backgroundColor: '#efefef', borderRadius: '12px' }}>
                    <Col span={12} className="postBottomLeft hoverBtn" onClick={likePost} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', padding: '10px' }}>
                        <LikeOutlined className='likeIcon' style={{ color: like == '0' ? 'black' : 'red', fontSize: '20px' }} />
                        <span className="postLikeCounter" >{numLikeComment.numLike}</span>
                        <span className="postLikeCounter" style={{ marginLeft: '5px' }}>  likes</span>
                    </Col>
                    <Col span={12} className="postBottomRight hoverBtn" onClick={handleGetComment} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', padding: '10px' }}>
                        <CommentOutlined style={{ fontSize: '20px', color: 'blue', padding: '0 4px' }} />
                        <span className="postCommentText">{numLikeComment.numComment} comments</span>
                    </Col>
                </Row>
                {commentInput.toggle &&
                    <div className='comment-container' style={{ padding: '16px 2px 0' }}>
                        {commentList.length > 0 &&
                            commentList.map((comment, index) => (
                                <div className='comment-item' key={index} style={{ padding: '8px 0' }}>
                                    <div style={{ display: 'flex' }}>
                                        <Avatar style={{ padding: '4px' }} size={35} src={`/images/${comment.user_id % 5 + 1}.png`} />
                                        <span style={{ fontSize: '16px', display: 'grid', justifyContent: 'left', alignContent: 'center', fontWeight: 'bold' }}>{comment.nickname}</span>
                                        <span style={{ fontSize: '12px', display: 'grid', justifyContent: 'left', alignContent: 'center', fontStyle: 'italic', paddingLeft: '4px' }}> - {moment(comment.created_at).fromNow()}</span>
                                    </div>
                                    <div style={{paddingLeft: '30px'}}>
                                        <div>{comment.content}</div>
                                        <LikeOutlined style={{ color: comment.Liked == '0' ? 'black' : 'red', fontSize: '16px', padding: '0 4px' }} onClick={() => handleLikeComment(comment.id)} />
                                        <span>{comment.numLike}</span>
                                    </div>
                                </div>
                            ))}
                        <Input.Group compact style={{ padding: '8px 2px', borderBottom: '1px solid #bdbdbd' }}>
                            <Avatar size={35} src={`/images/${user.id % 5 + 1}.png`} />
                            <Input style={{ width: 'calc(100% - 35px)' }}
                                onPressEnter={handleComment} bordered={false}
                                placeholder='Write comment...'
                                value={commentInput.content}
                                suffix={(<SendOutlined style={{ fontSize: '18px', color: '#3e8bff', paddingTop: '4px' }} onClick={handleComment} />)}
                                onChange={(e) => setCommentInput({ ...commentInput, content: e.target.value })} />
                        </Input.Group>
                    </div>
                }
            </div>
        </div>
    )
}

export default Post
