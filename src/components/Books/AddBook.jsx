import React, { useState } from "react";
import { Form, Input, Button, Upload, message, InputNumber, Select } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddBook = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([""]);
    const [coverFile, setCoverFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const navigate = useNavigate(); 

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

    const onFinish = async (values) => {
        if (!coverFile || !audioFile) {
            message.error("يرجى تحميل الغلاف والملف الصوتي!");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("cover", coverFile);
            formData.append("duration", values.duration);
            formData.append("audio", audioFile);
            formData.append("price", values.price);
            formData.append("price_points", values.price_points); // ✅ Added price_points
            formData.append("authorId", values.authorId);

            categories.forEach((categoryId, index) => {
                if (index === 0) {
                    formData.append("categoryId", categoryId); // First category
                } else {
                    formData.append(`categoryId[${index}]`, categoryId); // Subsequent categories
                }
            });


            await axios.post(`${api_url}/api/books/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("تمت إضافة الكتاب بنجاح!");
            form.resetFields();
            setCategories([""]);
            setCoverFile(null);
            setAudioFile(null);
            navigate("/categories");
        } catch (error) {
            console.error("Error adding book:", error);
            message.error("فشل في إضافة الكتاب. حاول مرة أخرى!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>إضافة كتاب جديد</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="عنوان الكتاب" name="title" rules={[{ required: true, message: "يرجى إدخال العنوان" }]}>
                    <Input placeholder="أدخل عنوان الكتاب" />
                </Form.Item>

                <Form.Item label="الوصف" name="description" rules={[{ required: true, message: "يرجى إدخال الوصف" }]}>
                    <Input.TextArea rows={3} placeholder="أدخل وصف الكتاب" />
                </Form.Item>

                <Form.Item label="الغلاف" name="cover" rules={[{ required: true, message: "يرجى تحميل الغلاف" }]}>
                    <Upload beforeUpload={() => false} maxCount={1} listType="picture" onChange={handleCoverChange}>
                        <Button icon={<UploadOutlined />}>تحميل الغلاف</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="مدة الكتاب (دقائق)" name="duration" rules={[{ required: true, message: "يرجى إدخال المدة" }]}>
                    <InputNumber min={1} placeholder="مدة الكتاب" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="الملف الصوتي" name="audio" rules={[{ required: true, message: "يرجى تحميل الملف الصوتي" }]}>
                    <Upload beforeUpload={() => false} maxCount={1} onChange={handleAudioChange}>
                        <Button icon={<UploadOutlined />}>تحميل الملف الصوتي</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="السعر" name="price" rules={[{ required: true, message: "يرجى إدخال السعر" }]}>
                    <InputNumber min={0} placeholder="أدخل السعر" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="نقاط السعر" name="price_points" rules={[{ required: true, message: "يرجى إدخال نقاط السعر" }]}>
                    <InputNumber min={0} placeholder="أدخل نقاط السعر" style={{ width: "100%" }} />
                </Form.Item>

                {/* 
                <Form.Item label="هل الكتاب مجاني؟" name="is_free" rules={[{ required: true, message: "يرجى اختيار حالة الكتاب" }]}>
                    <Select placeholder="اختر حالة الكتاب">
                        <Option value="true">نعم</Option>
                        <Option value="false">لا</Option>
                    </Select>
                </Form.Item> 
                */}

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
                        إضافة الكتاب
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddBook;
