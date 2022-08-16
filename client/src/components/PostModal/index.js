import { useState } from "react";
import { Modal, Form, TimePicker, InputNumber, Input, message } from "antd";
import axios from "../../api/axios";
import moment from 'moment';
import { useAppContext } from "../../context/AppContext";

const PostModal = ({ choice, post, setIsCreate, setIsUpdate }) => {
    const { handleAddMyPost } = useAppContext()
    const [isModalVisible, setIsModalVisible] = useState(true);
    const state = post != null ? post : {
        description: "",
        address: "",
        time_begin: "",
        time_end: "",
        star: "",
        images: null
    }
    const [form, setForm] = useState(state)

    const handleOk = async (e) => {
        if (!form.description || !form.address || !form.time_begin || !form.time_end || !form.star || !form.images) {
            message.warning("please fill in!")
            return
        }

        e.preventDefault();

        const formData = new FormData();
        formData.append("description", form.description);
        formData.append("address", form.address);
        formData.append("time_begin", form.time_begin);
        formData.append("time_end", form.time_end);
        formData.append("star", form.star);
        for (let i = 0; i < form.images.length; ++i) {
            formData.append("images[]", form.images.item(i));
        }

        console.log(formData);

        try {
            if (choice === 'create') {
                const res = await axios.post('/add-post', formData)
                const resData = res.data
                handleAddMyPost()
                message.success(resData.message)
            }
            if (choice === 'update') {
                const res = await axios.post(`/update-post/${post.post_id}`, formData)
                const resData = res.data
                handleAddMyPost()
                message.success(resData.message)
            }
        } catch (error) {
            message.error(error.message)
        }
        setIsModalVisible(false);
        if (choice === 'create') {
            setIsCreate(false)
        }
        if (choice === 'update') {
            setIsUpdate(false)
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        if (choice === 'create') {
            setIsCreate(false)
        }
        if (choice === 'update') {
            setIsUpdate(false)
        }
    };

    return (
        <Modal title={choice === 'create' ? 'Create new post' : 'Update post'}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
                name='postForm'
            >
                <Form.Item
                    name='description'
                    label='Description'
                >
                    <Input defaultValue={form.description} name="description" placeholder='description...' onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Form.Item>
                <Form.Item
                    name='address'
                    label='Address'
                >
                    <Input defaultValue={form.address} name="address" placeholder='address...' onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </Form.Item>
                <Form.Item
                    name='time_begin'
                    label="Time begin"
                >
                    <TimePicker defaultValue={form.time_begin === '' ? moment('00:00:00', 'HH:mm:ss') : moment(form.time_begin, 'HH:mm:ss')} name="time_begin" onChange={(time, timeString) => setForm({ ...form, time_begin: timeString })} />
                </Form.Item>
                <Form.Item
                    name='time_end'
                    label="Time end"
                >
                    <TimePicker defaultValue={form.time_end === '' ? moment('00:00:00', 'HH:mm:ss') : moment(form.time_end, 'HH:mm:ss')} name="time_end" onChange={(time, timeString) => setForm({ ...form, time_end: timeString })} />
                </Form.Item>
                <Form.Item
                    name='star'
                    label="Star"
                >
                    <InputNumber defaultValue={form.star === '0' ? '0' : form.star} name="star" min={0} max={5} onChange={(value) => setForm({ ...form, star: value })} />
                </Form.Item>
                <Form.Item
                    label="Images"
                    name='images[]'
                >
                    <Input name="images[]" accept="image/*" multiple type='file' onChange={(e) => setForm({ ...form, images: e.target.files })} />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default PostModal