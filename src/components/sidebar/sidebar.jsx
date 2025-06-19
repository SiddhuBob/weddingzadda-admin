import React, { useEffect, useState } from "react";
import { Button, Layout, Menu } from "antd";
import { useSideBar } from "../../context/nav-toggle";
import { BiEnvelope, BiLogOut } from "react-icons/bi";
import { FaList, FaUsersCog } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import MenuItem from "antd/es/menu/MenuItem";
import {
  CalendarFilled,
  CalendarOutlined,
  ProductOutlined,
  ScissorOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { removeToken } from "../../services/localStorageServices";
import { MdCategory, MdOutlineCategory } from "react-icons/md";
const { Sider } = Layout;

export default function Sidebar() {
  const { isOpen } = useSideBar();
  const [isSticky, setIsSticky] = useState(true);
  const navigate = useNavigate();
  const [key, setKey] = useState("1");
  const { pathname } = useLocation();

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  useEffect(() => {
    // Check screen size and print to console if less than 767 pixels
    if (window.innerWidth <= 767) {
      setIsSticky(false);
    } else {
      setIsSticky(true);
    }
    setKey(pathname);
  }, [pathname]);

  const items = [
    {
      key: "/dashboard",
      label: "Dasboard",
      icon: <ProductOutlined />,
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/community",
      label: "Community",
      icon: <FaList />,
      onClick: () => navigate("/community"),
    },
    {
      key: "/categories",
      label: "Categories",
      icon: <MdOutlineCategory />,
      children: [
        // {
        //   key: "/Service",
        //   icon: <MdOutlineCategory />,
        //   onClick: () => navigate("/Service"),
        //   label: "Service",
        // },
        // {
        //   key: "/Service",
        //   icon: <MdOutlineCategory />,
        //   onClick: () => navigate("/Service"),
        //   label: "Service",
        // },
        {
          key: "/main-categories",
          icon: <MdOutlineCategory />,
          onClick: () => navigate("/main-categories"),
          label: "Main Categories",
        },
        {
          key: "/sub-categories",
          icon: <MdCategory />,
          onClick: () => navigate("/sub-categories"),
          label: "Sub Categories",
        },
      ],
    },
    // {
    //   key: "/services",
    //   label: "Services",
    //   icon: <ScissorOutlined />,
    //   onClick: () => navigate("/services"),
    // },
    {
      key: "/vendors",
      label: "Vendors",
      icon: <ScissorOutlined />,
      onClick: () => navigate("/vendors"),
    },
    // {
    //   key: "/time-table",
    //   label: "Time Table",
    //   icon: <CalendarOutlined />,
    //   onClick: () => navigate("/time-table"),
    // },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    {
      key: "/eventsandcommunity",
      label: "Events and Community",
      icon: <CalendarOutlined />,
      onClick: () => navigate("/eventsandcommunity"),
    },
>>>>>>> Stashed changes
    {
      key: "/user",
      label: "User",
      icon: <UserOutlined />,
      onClick: () => navigate("/user"),
    },
    // {
    //   key: "/messaging",
    //   label: "Messaging",
    //   icon: <BiEnvelope />,
    //   onClick: () => navigate("/messaging"),
    // },
    {
      label: isOpen ? (
        "Log Out"
      ) : (
        <Button className="w-100" icon={<BiLogOut />}>
          Log Out
        </Button>
      ),
      icon: isOpen && <BiLogOut />,
      onClick: () => logout(),
    },
  ];

  return (
    <>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: isSticky ? "sticky" : "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        trigger={null}
        collapsed={isOpen}
        collapsedWidth={isSticky ? 80 : 0}
      >
        <div
          className="demo-logo-vertical"
          style={{
            padding: "10px",
            textAlign: "center",
            color: "#fff",
            fontSize: "1.3rem",
          }}
        >
          Admin Panel
        </div>
        <Menu theme="dark" mode="vertical" selectedKeys={[key]} items={items} />
      </Sider>
    </>
  );
}
