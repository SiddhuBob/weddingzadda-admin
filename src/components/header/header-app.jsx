import React, { useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, Avatar } from "antd";
import { useSideBar } from "../../context/nav-toggle";
import { UserOutlined } from "@ant-design/icons";
import logo from "../../images/O-hair-logo.png";
import "./header.css";
// import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { getProfile, getToken } from "../../services/localStorageServices";
import { useDispatch, useSelector } from "react-redux";
import { setUserToken } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function Headers({ colorBgContainer }) {
  const { isOpen, toggle } = useSideBar();
  const { access_token } = getToken();
  const { profile } = getProfile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(setUserToken({ token: access_token }));
  }, [access_token, dispatch]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <Header
      style={{
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 10px",
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
      }}
    >
      <Button
        type="text"
        icon={isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggle}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <div className="imageLogo">
        <img src={logo} style={{ transform: "scale(.8)" }} alt="Logo" />
      </div>

      <div className="user_detail">
        <Avatar size={40} src={profile.image} icon={<UserOutlined />} />
        &nbsp;
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: 10,
            lineHeight: "20px",
          }}
        >
          <strong style={{ lineHeight: "unset", boxSizing: "unset" }}>
            {profile.first_name}
          </strong>
          <span style={{ lineHeight: "unset", boxSizing: "unset" }}>
            {profile.last_name}
          </span>
        </div>
      </div>
    </Header>
  );
}
