import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api_url } from '../../utils/api';
import { Form, Input, Button, Row, Col, Typography, message, Card, Image, Checkbox } from 'antd';
import SardLogo from "../../assets/sardlogo.png";

const { Title, Paragraph } = Typography;

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${api_url}/api/auth/admin-login`, {
                email,
                password,
            });
            localStorage.setItem('token', response.data.token);
            message.success('Login successfully.');
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            message.error('Login failed. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                padding: "20px",
                background: 'linear-gradient(179.95deg, #FFFFFF -36.74%, rgba(112, 169, 114, 0.6) 99.96%)',
                minHeight: '100vh',
                width: '100%',
                margin: 0
            }}
        >
            <Col xs={22} sm={18} md={14} lg={10} xl={8}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Image
                        src={SardLogo}
                        alt="sard_logo"
                        preview={false}
                        style={{ maxWidth: "150px", height: "auto" }}
                    />
                </div>

                <Card
                    style={{
                        padding: "16px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        borderRadius: "12px",
                        background: "#fff",
                        textAlign: 'center',
                        maxWidth: "380px",
                        margin: "0 auto",
                        width: "100%"
                    }}
                >
                    <Title level={3} style={{ color: "#70A972" }}>Welcome to Sard</Title>
                    <Paragraph>
                        Manage your products, orders, and categories easily with our admin dashboard. 
                        Sign in to access your control panel.
                    </Paragraph>

                    <Title level={2} style={{ marginBottom: '20px' }}>Login</Title>
                    <Form onFinish={handleLogin} layout="vertical">
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please input your Email!' },
                                { type: 'email', message: 'The input is not a valid email!' }
                            ]}
                        >
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item style={{display:"flex" , justifyContent:"start"}}>
                            <Checkbox>Remember Me</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                style={{ backgroundColor: "#70A972", color: "white" }}
                                htmlType="submit"
                                block
                                loading={loading}
                                size="large"
                            >
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default Auth;
