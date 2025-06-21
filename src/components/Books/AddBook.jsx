import { useState, useEffect } from "react";
import {
    Form, Input, Button, Upload, message, InputNumber, Radio, Modal, Select,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { FaMagic } from "react-icons/fa";

const { Option } = Select;

const AddBook = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [coverFile, setCoverFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [suggestTitle, setSuggestTitle] = useState("");
    const [suggestGenre, setSuggestGenre] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryFields, setCategoryFields] = useState([0]);
    const [authors, setAuthors] = useState([]);
    const [isFree, setIsFree] = useState(false);
    const [pricingOption, setPricingOption] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            try {
                const [categoriesRes, authorsRes] = await Promise.all([
                    axios.get(`${api_url}/api/categories`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${api_url}/api/authors`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setCategories(categoriesRes.data);
                setAuthors(authorsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleCoverChange = ({ file }) => {
        setCoverFile(file);
    };

    const handleAudioChange = ({ file }) => {
        setAudioFile(file);
    };

    const addCategoryField = () => {
        setCategoryFields([...categoryFields, categoryFields.length]);
    };

    const cleanDescription = (desc) => {
        return desc.replace(/[\n\/]/g, '').trim();
    };

    const handleSuggestDescription = async () => {
        const token = localStorage.getItem("token");
        if (!suggestTitle || !suggestGenre) {
            message.error("Please enter title and genre");
            return;
        }

        try {
            const response = await axios.post(
                `${api_url}/api/books/suggest-description`,
                {
                    title: suggestTitle,
                    genre: suggestGenre,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const cleanedDescription = cleanDescription(response.data.description);
            form.setFieldsValue({ description: cleanedDescription });
            message.success("Description suggested successfully!");
            setIsModalVisible(false);
        } catch (error) {
            console.error("Suggestion error:", error);
            message.error("Failed to suggest description!");
        }
    };

    const onFinish = async (values) => {
        if (!coverFile || !audioFile) {
            message.error("Please upload cover and audio file!");
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
            formData.append("is_free", isFree);
            if (!isFree) {
                if (pricingOption === "price") {
                    formData.append("price", values.price || null);
                } else if (pricingOption === "price_points") {
                    formData.append("price_points", values.price_points || null);
                }
            }

            values.categories.forEach((catId) => {
                formData.append("categoryId", catId);
            });
            formData.append("authorId", values.authorId);

            await axios.post(`${api_url}/api/books/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            message.success("Book added successfully!");
            form.resetFields();
            setCategories([""]);
            setCoverFile(null);
            setAudioFile(null);
            navigate("/books");
        } catch (error) {
            console.error("Error adding book:", error);
            message.error("Failed to add book. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <Button
                onClick={() => navigate("/books")}
                type="primary"
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
                Back to Books
            </Button>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Add New Book</h2>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item label="Book Title" name="title" rules={[{ required: true, message: "Please enter title" }]}>
                    <Input placeholder="Enter book title" />
                </Form.Item>

                <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter description" }]}>
                    <Input.TextArea rows={3} placeholder="Enter book description" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" onClick={() => setIsModalVisible(true)}>Suggest Description <FaMagic /></Button>
                </Form.Item>

                <Form.Item label="Cover" name="cover" rules={[{ required: true, message: "Please upload cover" }]}>
                    <Upload beforeUpload={() => false} maxCount={1} listType="picture" onChange={handleCoverChange}>
                        <Button icon={<UploadOutlined />}>Upload Cover</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Duration (minutes)" name="duration" rules={[{ required: true, message: "Please enter duration" }]}>
                    <InputNumber min={1} placeholder="Book duration" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Audio File" name="audio" rules={[{ required: true, message: "Please upload audio file" }]}>
                    <Upload beforeUpload={() => false} maxCount={1} onChange={handleAudioChange}>
                        <Button icon={<UploadOutlined />}>Upload Audio File</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Is the book free?">
                    <Radio.Group onChange={(e) => setIsFree(e.target.value)}>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Radio.Group>
                </Form.Item>

                {!isFree && (
                    <>
                        <Form.Item label="Select Pricing Option">
                            <Radio.Group
                                value={pricingOption}
                                onChange={(e) => {
                                    setPricingOption(e.target.value);
                                    form.setFieldsValue({ price: null, price_points: null });
                                }}
                            >
                                <Radio value="price">Price</Radio>
                                <Radio value="price_points">Price Points</Radio>
                            </Radio.Group>
                        </Form.Item>

                        {pricingOption === "price" && (
                            <Form.Item
                                label="Price"
                                name="price"
                                rules={[{ required: true, message: "Please enter price" }]}
                            >
                                <InputNumber min={0} placeholder="Enter price" style={{ width: "100%" }} />
                            </Form.Item>
                        )}

                        {pricingOption === "price_points" && (
                            <Form.Item
                                label="Price Points"
                                name="price_points"
                                rules={[{ required: true, message: "Please enter price points" }]}
                            >
                                <InputNumber min={0} placeholder="Enter price points" style={{ width: "100%" }} />
                            </Form.Item>
                        )}
                    </>
                )}
                <Form.Item label="Author" name="authorId" rules={[{ required: true, message: "Please select author" }]}>
                    <Select placeholder="Select an author">
                        {authors.map((author) => (
                            <Option key={author.id} value={author.id}>
                                {author.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {categoryFields.map((field, index) => (
                    <Form.Item
                        key={field}
                        name={['categories', index]}
                        label={index === 0 ? "Categories" : ""}
                        rules={[{ required: true, message: "Please select category" }]}
                    >
                        <Select placeholder="Select category">
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                ))}

                <Button
                    type="dashed"
                    onClick={addCategoryField}
                    block
                    icon={<PlusOutlined />}
                >
                    Add Another Category
                </Button>

                <Form.Item style={{ textAlign: "center", marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Add Book
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Suggest Description"
                visible={isModalVisible}
                onOk={handleSuggestDescription}
                onCancel={() => setIsModalVisible(false)}
                okText="Suggest"
                cancelText="Cancel"
            >
                <Input
                    placeholder="Book Title"
                    value={suggestTitle}
                    onChange={(e) => setSuggestTitle(e.target.value)}
                    style={{ marginBottom: 10 }}
                />
                <Input
                    placeholder="Genre"
                    value={suggestGenre}
                    onChange={(e) => setSuggestGenre(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default AddBook;