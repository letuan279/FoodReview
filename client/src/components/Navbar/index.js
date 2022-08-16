import { Button, Row, div, Image, Dropdown, Menu, Table, Space, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import { useAppContext } from '../../context/AppContext'

const NavBar = () => {
    const { handleLogout, authState: { user } } = useAppContext()

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <Link to={'/home/myPost'}>
                            <a>My Posts</a>
                        </Link>
                    )
                },
                {
                    key: '2',
                    label: (
                        <a onClick={handleLogout}>Logout</a>
                    )
                }
            ]}
        />
    )

    return (
        <div style={{ display: 'flex', width: '100%' }} >
            <div >
                <Link to={'/home'}>
                    <Image
                        src='https://www.codester.com/static/uploads/items/000/018/18519/preview.jpg'
                        preview={false}
                        width={150}
                        height={80}
                    />
                </Link>
            </div>
            <div style={{ display: 'grid', alignContent: 'center', justifyContent: 'center', margin: '0 40px 0 auto', cursor: 'pointer' }}>
                <Dropdown overlay={menu}>
                    {/* <Row>
                        <div span={6} style={{ padding: '2px', display: 'grid' }}>
                            <Avatar size={50} src={`images/${user.id % 5 + 1}.png`} />
                        </div>
                        <div span={14} style={{ padding: '0 4px', display: 'grid', justifyContent: 'center', alignContent: 'center' }}>
                            <div style={{ fontSize: '18px', display: 'grid', justifyContent: 'center', alignContent: 'center' }}>{user && user.nickname}</div>
                        </div>
                        <div span={2} className='center'>
                            <DownOutlined />
                        </div>
                    </Row> */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }} >
                        <Avatar size={50} src={`/images/${user.id % 5 + 1}.png`} />
                        <div style={{ fontSize: '18px', display: 'grid', justifyContent: 'center', alignContent: 'center', padding: '0 10px' }}>{user && user.nickname}</div>
                        <DownOutlined style={{ display: 'grid', justifyContent: 'center', alignContent: 'center', fontSize: '12px' }} />
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default NavBar
