import { useState } from "react"
import { SearchOutlined, ClearOutlined, FileSearchOutlined } from '@ant-design/icons'
import { Form, TimePicker, InputNumber, Input, Button, message, Rate } from "antd";
import moment from 'moment';
import axios from "../../api/axios";

const Search = ({ setPostList }) => {

    const [searchForm, setSearchForm] = useState({
        address: "",
        time_begin: "00:00:00",
        time_end: "23:59:59",
        star: ""
    })

    const handleSearch = async () => {
        const formData = new FormData();
        formData.append("address", searchForm.address ?? '');
        formData.append("time_begin", searchForm.time_begin ?? '00:00:00');
        formData.append("time_end", searchForm.time_end ?? '23:59:59');
        formData.append("star", searchForm.star ?? '');


        try {
            const res = await axios.post('/search', formData)
            const resData = res.data
            const postIdList = resData.data.map((item) => item.post_id)
            setPostList(postIdList)
            message.success(`${postIdList.length} posts được tìm thấy`)
        }
        catch (error) {
            message.error(error.message)
        }
    }

    const handleClose = () => {
        setPostList([])
        message.success("Đã xóa kết quả tìm kiếm")
    }

    return (
        <div className="search-container" style={{ padding: '0 20px' }}>
            <div style={{ display: "grid", justifyContent: "center", alignContent: "center", padding: '20px 0', fontSize: '20px', fontWeight: "bold" }}>
                <span>Filter <FileSearchOutlined /></span>
            </div>
            <div>
                <Form
                    name='form'
                >
                    <Form.Item
                        name='address'
                        label='Address'
                    >
                        <Input value={searchForm.address} name="address" placeholder='. . . Hai Bà Trưng, Hà Nội' onChange={(e) => setSearchForm({ ...searchForm, address: e.target.value })} />
                    </Form.Item>
                    <Form.Item
                        name='time_begin'
                        label="Time begin"
                    >
                        <TimePicker defaultValue={moment(searchForm.time_begin, 'HH:mm:ss')} name="time_begin" onChange={(time, timeString) => setSearchForm({ ...searchForm, time_begin: timeString })} />
                    </Form.Item>
                    <Form.Item
                        name='time_end'
                        label="Time end"
                    >
                        <TimePicker defaultValue={moment(searchForm.time_end, 'HH:mm:ss')} name="time_end" onChange={(time, timeString) => setSearchForm({ ...searchForm, time_end: timeString })} />
                    </Form.Item>
                    <Form.Item
                        name='star'
                        label="Star"
                    >
                        <Rate onChange={(value) => setSearchForm({ ...searchForm, star: value })} value={searchForm.star} />
                    </Form.Item>
                    <Form.Item
                        name='button'
                    >
                        <Button onClick={handleSearch}>Search<SearchOutlined /></Button>
                        <Button onClick={handleClose}>Clear<ClearOutlined /></Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Search