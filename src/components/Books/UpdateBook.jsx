import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    Upload,
    InputNumber,
    Radio,
    Select,
    message,
    Spin,
} from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { api_url } from "../../utils/api";

const { TextArea } = Input;
const { Option } = Select;

const UpdateBook = () => {
    const [form] = Form.useForm();
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState({});
    const [coverFile, setCoverFile] = useState(null);
    const [audioFile, setAudioFile] = useState(null);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryInputs, setCategoryInputs] = useState([0]);
    const [isFree, setIsFree] = useState(true);
    const [pricingOption, setPricingOption] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookRes, authorsRes, categoriesRes] = await Promise.all([
                    axios.get(`${api_url}/api/books/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${api_url}/api/authors/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${api_url}/api/categories/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const book = bookRes.data;
                setInitialData(book);
                setAuthors(authorsRes.data);
                setCategories(categoriesRes.data);

                const matchedAuthor = authorsRes.data.find(
                    (a) => a.name === book.Author?.name
                );

                setIsFree(book.is_free);
                setPricingOption(
                    book.price_points > 0 ? "price_points" : "price"
                );

                form.setFieldsValue({
                    title: book.title,
                    description: book.description,
                    duration: book.duration,
                    is_free: book.is_free,
                    price: book.price || null,
                    price_points: book.price_points || null,
                    authorId: matchedAuthor?.id,
                });

                const initialCategoryIds = book.BookCategory.map((cat) => cat.id);
                setCategoryInputs(
                    initialCategoryIds.length > 0
                        ? initialCategoryIds.map((_, i) => i)
                        : [0]
                );
                initialCategoryIds.forEach((catId, index) => {
                    form.setFieldValue(`categoryId_${index}`, catId);
                });

                setLoading(false);
            } catch (err) {
                message.error("فشل في تحميل البيانات.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id, form]);

    const handleAddCategoryInput = () => {
        setCategoryInputs((prev) => [...prev, prev.length]);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("duration", values.duration);
        formData.append("is_free", isFree);
        formData.append("authorId", values.authorId);

        if (!isFree) {
            if (pricingOption === "price") {
                formData.append("price", values.price);
                formData.append("price_points", null);
            } else if (pricingOption === "price_points") {
                formData.append("price_points", values.price_points);
                formData.append("price", null);
            }
        } else {
            formData.append("price", null);
            formData.append("price_points", null);
        }

        categoryInputs.forEach((index, i) => {
            const catId = values[`categoryId_${index}`];
            if (catId) {
                formData.append(`categoryId[${i}]`, catId);
            }
        });

        if (coverFile) formData.append("cover", coverFile);
        if (audioFile) formData.append("audio", audioFile);

        try {
            await axios.patch(`${api_url}/api/books/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            message.success("تم تحديث الكتاب بنجاح");
            navigate("/books");
        } catch (error) {
            message.error("فشل في تحديث الكتاب.");
        }
    };

    if (loading)
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );

    return (
        <div style={{ padding: 20 }}>
            <h2 style={{ textAlign: "center", marginBottom: 20 }}>Update Book</h2>
            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                initialValues={{ is_free: true }}
            >
                <Form.Item name="title" label="Book Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                    <TextArea rows={6} />
                </Form.Item>

                <Form.Item label="Upload New Cover (optional)">
                    <Upload
                        beforeUpload={(file) => {
                            setCoverFile(file);
                            return false;
                        }}
                        showUploadList={true}
                        maxCount={1}
                        listType="picture"
                    >
                        <Button icon={<UploadOutlined />}>تحميل</Button>
                    </Upload>
                    {initialData.cover && (
                        <img
                            src={initialData.cover}
                            alt="cover"
                            style={{ width: 100, marginTop: 10 }}
                        />
                    )}
                </Form.Item>

                <Form.Item name="duration" label="Book Duration (minutes)" rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Upload new audio file (optional)">
                    <Upload
                        beforeUpload={(file) => {
                            setAudioFile(file);
                            return false;
                        }}
                        showUploadList={true}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>تحميل</Button>
                    </Upload>
                    {initialData.audio && (
                        <div style={{ marginTop: 10 }}>
                            <a href={initialData.audio} target="_blank" rel="noopener noreferrer">
                                Listen to current audio file
                            </a>
                        </div>
                    )}
                </Form.Item>

                <Form.Item name="is_free" label="Is Book Free">
                    <Radio.Group
                        onChange={(e) => {
                            setIsFree(e.target.value);
                            setPricingOption(null);
                        }}
                        value={isFree}
                    >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                    </Radio.Group>
                </Form.Item>

                {!isFree && (
                    <>
                        <Form.Item label="Choose Price Type">
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
                            <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                        )}

                        {pricingOption === "price_points" && (
                            <Form.Item name="price_points" label="Price Points" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                        )}
                    </>
                )}

                <Form.Item name="authorId" label="Author" rules={[{ required: true }]}>
                    <Select placeholder="Choose Author">
                        {authors.map((author) => (
                            <Option key={author.id} value={author.id}>
                                {author.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <label>Categories</label>
                {categoryInputs.map((index) => (
                    <Form.Item key={index} name={`categoryId_${index}`} style={{ marginTop: "8px" }}>
                        <Select placeholder="Choose Category">
                            {categories.map((cat) => (
                                <Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                ))}

                <Form.Item>
                    <Button
                        type="dashed"
                        onClick={handleAddCategoryInput}
                        icon={<PlusOutlined />}
                        block
                    >
                        Add Another Category
                    </Button>
                </Form.Item>

                <Form.Item style={{ marginTop: 20 }}>
                    <Button type="primary" htmlType="submit" block>
                        Update Book
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateBook;