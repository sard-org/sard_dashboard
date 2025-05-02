import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { api_url } from "../../utils/api";
import Title from "antd/es/typography/Title";

const { confirm } = Modal;

const AllBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marginLeft, setMarginLeft] = useState(190);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();

        const handleResize = () => {
            setMarginLeft(window.innerWidth < 768 ? 0 : 190);
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Set initially

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(`${api_url}/api/books/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            message.error("فشل في جلب البيانات، حاول مرة أخرى");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        confirm({
            title: "هل أنت متأكد أنك تريد حذف هذا الكتاب؟",
            icon: <ExclamationCircleOutlined />,
            content: "لن تتمكن من استعادته لاحقًا!",
            okText: "نعم، احذف",
            okType: "danger",
            cancelText: "إلغاء",
            onOk() {
                handleDelete(id);
            },
        });
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${api_url}/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success("تم حذف الكتاب بنجاح!");
            fetchBooks();
        } catch (error) {
            message.error("فشل في حذف الكتاب!");
        }
    };

    const columns = [
        {
            title: "#",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "غلاف الكتاب",
            dataIndex: "cover",
            key: "cover",
            render: (cover) => (
                <img
                    src={cover}
                    alt="Book Cover"
                    style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 5,
                    }}
                />
            ),
        },
        {
            title: "عنوان الكتاب",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: "المؤلف",
            dataIndex: "author",
            key: "author",
            sorter: (a, b) => (a.author || "").localeCompare(b.author || ""),
        },
        {
            title: "الإجراءات",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<InfoCircleOutlined />}
                        onClick={() => navigate(`/books/${record.id}`)}
                    />
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/books/update/${record.id}`)}
                    />
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => confirmDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingTop: 20, marginLeft: marginLeft , marginTop : 24 }}>
            <Title level={2}>All Books</Title>
            <Table
                columns={columns}
                dataSource={books.map((book, index) => ({
                    ...book,
                    key: book.id,
                    index,
                    author: book.Author ? book.Author.name : "غير معروف",
                }))}
                pagination={{ pageSize: 6 }}
                loading={loading}
                bordered
            />
        </div>
    );
};

export default AllBook;