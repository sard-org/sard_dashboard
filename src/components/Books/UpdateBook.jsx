import React, { useEffect, useState } from "react";
import {
    Form, Input, Button, Upload, message, InputNumber
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBook = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([""]);
    const [coverFile, setCoverFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const handleCoverChange = ({ file }) => {
        setCoverFile(file);
    };

    const handleAudioChange = ({ file }) => {
        setAudioFile(file);
    };

    const addCategoryField = () => {
        setCategories([...categories, ""]);
    };

    const handleCategoryChange = (value, index) => {
        const updatedCategories = [...categories];
        updatedCategories[index] = value;
        setCategories(updatedCategories);
    };

    const fetchBook = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${api_url}/api/books/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const book = response.data;
            form.setFieldsValue({
                title: book.title,
                description: book.description,
                duration: book.duration,
                price: book.price,
                price_points: book.price_points,
                authorId: book.authorId,
            });

            setCategories(book.categoryId instanceof Array ? book.categoryId : [book.categoryId]);
        } catch (error) {
            console.error("Failed to fetch book:", error);
            message.error("فشل في تحميل بيانات الكتاب!");
        }
    };

    useEffect(() => {
        fetchBook();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("duration", values.duration);
            formData.append("price", values.price);
            formData.append("price_points", values.price_points);
            formData.append("authorId", values.authorId);

            if (coverFile) formData.append("cover", coverFile);
            if (audioFile) formData.append("audio", audioFile);

            categories.forEach((categoryId, index) => {
                if (index === 0) {
                    formData.append("categoryId", categoryId);
                } else {
                    formData.append(`categoryId[${index}]`, categoryId);
                }
            });

            await axios.put(`${api_url}/api/books/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("تم تحديث الكتاب بنجاح!");
            navigate("/categories");
        } catch (error) {
            console.error("Error updating book:", error);
            message.error("فشل في تحديث الكتاب!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>تحديث الكتاب</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="عنوان الكتاب" name="title" rules={[{ required: true, message: "يرجى إدخال العنوان" }]}>
                    <Input placeholder="أدخل عنوان الكتاب" />
                </Form.Item>

                <Form.Item label="الوصف" name="description" rules={[{ required: true, message: "يرجى إدخال الوصف" }]}>
                    <Input.TextArea rows={3} placeholder="أدخل وصف الكتاب" />
                </Form.Item>

                <Form.Item label="الغلاف" name="cover">
                    <Upload beforeUpload={() => false} maxCount={1} listType="picture" onChange={handleCoverChange}>
                        <Button icon={<UploadOutlined />}>تحميل غلاف جديد (اختياري)</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="مدة الكتاب (دقائق)" name="duration" rules={[{ required: true, message: "يرجى إدخال المدة" }]}>
                    <InputNumber min={1} placeholder="مدة الكتاب" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="الملف الصوتي" name="audio">
                    <Upload beforeUpload={() => false} maxCount={1} onChange={handleAudioChange}>
                        <Button icon={<UploadOutlined />}>تحميل ملف صوتي جديد (اختياري)</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="السعر" name="price" rules={[{ required: true, message: "يرجى إدخال السعر" }]}>
                    <InputNumber min={0} placeholder="أدخل السعر" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="نقاط السعر" name="price_points" rules={[{ required: true, message: "يرجى إدخال نقاط السعر" }]}>
                    <InputNumber min={0} placeholder="أدخل نقاط السعر" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="معرف المؤلف" name="authorId" rules={[{ required: true, message: "يرجى إدخال معرف المؤلف" }]}>
                    <Input placeholder="أدخل معرف المؤلف" />
                </Form.Item>

                <label>الفئات</label>
                {categories.map((category, index) => (
                    <Form.Item
                        key={index}
                        name={index === 0 ? "categoryId" : `categoryId[${index}]`}
                        rules={[{ required: true, message: "يرجى إدخال معرف الفئة" }]}
                    >
                        <Input
                            placeholder="أدخل معرف الفئة"
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value, index)}
                        />
                    </Form.Item>
                ))}

                <Button type="dashed" onClick={addCategoryField} block icon={<PlusOutlined />}>
                    إضافة فئة أخرى
                </Button>

                <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        تحديث الكتاب
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateBook;