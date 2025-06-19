import React, { useEffect, useState } from "react";
import { Alert, Button, Checkbox, Form, Input, message } from "antd";
import { Typography } from "antd";
import axios from "axios";
import {
  getToken,
  setProfile,
  storeToken,
} from "../services/localStorageServices";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { post } from "../services/Base_Api";

const Login = () => {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const [messageType, setMessageType] = useState({
    show: false,
    text: "",
  });
  const navigate = useNavigate();

  //   ======================= Submit Login Details =====================
  const onFinish = async (values) => {
    const formData = new FormData();

    formData.append("email", values.username);
    formData.append("password", values.password);
    formData.append("user_type", "vendor");
    formData.append("action", "login");

    try {
      const response = await post("/login", formData);
      if (response) {
        dispatch(setUserToken({ token: response.user }));
        storeToken(response.user, values.remember);
        setProfile(response.user, values.remember);
        navigate("/");
      }
    } catch (error) {
      message.error("Login Failed");
    }
  };

  const { access_token } = getToken();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setUserToken({ token: access_token }));
  }, [access_token, dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="loginSection">
      <div className="loginBox">
        <Title level={2}>Admin Login</Title>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            {messageType.show && (
              <Alert
                style={{ marginTop: "20px" }}
                message={messageType.text}
                type="error"
                showIcon
              />
            )}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default Login;
