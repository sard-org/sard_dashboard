import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message, Card, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { api_url } from "../../utils/api";

const UpdateAuthor = () => {
    const { id: authorId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchAuthorDetails = async () => {
            if (!authorId) return;
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`${api_url}/api/authors/${authorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                form.setFieldsValue({ name: response.data.name });

                // Set current photo if available
                if (response.data.photo) {
                    setFileList([
                        {
                            uid: "-1",
                            name: "current_photo.jpg",
                            status: "done",
                            url: response.data.photo, // should be full URL to image
                        },
                    ]);
                }
            } catch (error) {
                message.error("فشل في جلب بيانات المؤلف!");
            }
        };

        fetchAuthorDetails();
    }, [authorId, form]);

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            setFile(newFileList[0].originFileObj);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();
            formData.append("name", values.name);
            if (file) {
                formData.append("photo", file);
            }

            await axios.patch(`${api_url}/api/authors/${authorId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("تم تحديث المؤلف بنجاح!");
            navigate(`/authors`);
        } catch (error) {
            message.error("فشل في تحديث المؤلف!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Space style={{ marginBottom: 16 }}>
                <Button type="default" onClick={() => navigate("/authors")}>
                    العودة إلى المؤلفين
                </Button>
            </Space>

            <Card title="تعديل المؤلف" style={{ width: "100%", margin: "auto", marginTop: 20 }}>
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="اسم المؤلف"
                        rules={[{ required: true, message: "يرجى إدخال اسم المؤلف" }]}
                    >
                        <Input placeholder="أدخل اسم المؤلف" />
                    </Form.Item>

                    <Form.Item label="رفع الصورة">
                        <Upload
                            beforeUpload={() => false}
                            onChange={handleFileChange}
                            showUploadList={true}
                            maxCount={1}
                            fileList={fileList}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>اختر صورة</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            تحديث المؤلف
                        </Button>
                        <Button onClick={() => navigate("/authors")} style={{ marginLeft: "10px" }}>
                            إلغاء
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default UpdateAuthor;