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
    const navigate = useNavigate();

    const handleUpload = ({ file }) => {
        setFile(file);
    };

    const handleSubmit = async (values) => {
        if (!file) {
            message.error("Please upload an image!");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            message.error("You must be logged in!");
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

            message.success("Category added successfully!");
            form.resetFields();
            setFile(null);
            navigate("/categories");
        } catch (error) {
            message.error("Failed to add category!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Button 
                onClick={() => navigate("/categories")} 
                style={{
                    marginBottom: 20,
                    padding: "8px 16px",
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "none",
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    borderRadius: "4px"
                }}
            >
                Back to Categories
            </Button>

            <Form layout="vertical" form={form} onFinish={handleSubmit}>
                <Form.Item name="name" label="Category Name" rules={[{ required: true, message: "Please enter a category name" }]}>
                    <Input placeholder="Enter category name" />
                </Form.Item>

                <Form.Item label="Upload Image">
                    <Upload beforeUpload={() => false} onChange={handleUpload} showUploadList={true}>
                        <Button icon={<UploadOutlined />}>Choose Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
                        Add Category
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddCategory;