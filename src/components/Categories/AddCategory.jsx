import React, { useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate(); // Use useNavigate for redirection

    const handleUpload = ({ file }) => {
        setFile(file);
    };

    const handleSubmit = async (values) => {
        if (!file) {
            message.error("يرجى رفع صورة!");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            message.error("يجب تسجيل الدخول!");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("photo", file);

            await axios.post(`${api_url}/api/categories`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("تمت إضافة الفئة بنجاح!");
            form.resetFields();
            setFile(null);
            navigate("/categories"); // Redirect to the categories page after successful addition
        } catch (error) {
            message.error("فشل في إضافة الفئة!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="name" label="اسم الفئة" rules={[{ required: true, message: "يرجى إدخال اسم الفئة" }]}>
                <Input placeholder="أدخل اسم الفئة" />
            </Form.Item>

            <Form.Item label="رفع الصورة">
                <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={true}>
                    <Button icon={<UploadOutlined />}>اختر صورة</Button>
                </Upload>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    إضافة الفئة
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddCategory;