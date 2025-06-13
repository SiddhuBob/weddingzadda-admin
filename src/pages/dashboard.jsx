import React, { useEffect, useState } from "react";
import { getProfile, getToken } from "../services/localStorageServices";
import { MdDashboard } from "react-icons/md";
import { SiLibreofficewriter } from "react-icons/si";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { Button, List, Spin, Table } from "antd";
import user from "../images/image.png";
import {
  FaArrowRightLong,
  FaCartShopping,
  FaIndianRupeeSign,
} from "react-icons/fa6";
import { get } from "../services/Base_Api";
import moment from "moment";
import { Popover, Tag } from "antd";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CardListComp from "../components/CardListComp";

const days = [
  "",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function Dashboard() {
  const { profile } = getProfile();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const navigate = useNavigate();
  const [timeTabel, setTimeTable] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const handleFetch = async () => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(`/appointments?page=${0}&limit=${15}`, header);

      if (resp) {
        setAppointments(resp?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTime = async () => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(`/slots?page=${0}&limit=${20}`, header);

      if (resp) {
        setTimeTable(resp?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAnyalitcs = async () => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await get(`/dashboard-analytics`, header);

      if (resp) {
        setAnalytics(resp?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dbounce = setTimeout(() => {
      handleFetch();
      handleFetchTime();
      handleFetchAnyalitcs();
    }, 300);
    return () => {
      clearTimeout(dbounce);
    };
  }, []);

  const appointmentcolumn = [
    {
      title: "Date",
      key: "appointment_date",
      dataIndex: "appointment_date",
      render: (text, record) => moment(text).format("DD MMM YYYY"),
    },
    {
      title: "Slot",
      key: "appointment_time",
      dataIndex: "appointment_time",
    },
    {
      title: "User",
      key: "user",
      dataIndex: "user",
      render: (text, record) =>
        record?.user?.first_name + " " + record?.user?.last_name,
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
      render: (text, record) => record?.user?.phone_number,
    },
    {
      title: "Services",
      key: "services",
      dataIndex: "services",
      render: (text, record) => (
        <Popover
          content={
            <div style={{ width: 300 }}>
              {record?.services?.map((val, index) => (
                <div className="row">
                  <div className="col-1">{index + 1})</div>
                  <div className="col-7">{val.name}</div>
                  <div className="col-4 d-flex align-items-center">
                    <FaIndianRupeeSign style={{ fontSize: ".85rem" }} />
                    &nbsp;
                    {val.price}
                  </div>
                </div>
              ))}
            </div>
          }
          title="Services"
        >
          <span style={{ cursor: "pointer" }}>
            {record?.services?.length} Services
            <FaAngleDown />
          </span>
        </Popover>
      ),
    },
    {
      title: "Status",
      key: "appointment_status",
      dataIndex: "appointment_status",
      render: (text, record) => (
        <Tag
          color={
            text === "Success" ? "blue" : text === "Completed" ? "green" : "red"
          }
        >
          {text}
        </Tag>
      ),
    },
  ];

  return (
    <div className="first_dashboard">
      <div className="row">
        <div className="col-lg-8">
          <div className="box_card mb-4">
            <div className="row">
              <div className="col-8">
                <h3>
                  Welcome Back'{" "}
                  <span style={{ textTransform: "capitalize" }}>
                    {profile.role}
                  </span>
                </h3>
                <h4>
                  <FaUserCircle />
                  &nbsp; {profile.first_name + " " + profile.last_name}
                </h4>
                <p>
                  Welcome back! We're glad to have you here. Manage your
                  dashboard and keep everything running smoothly.
                </p>
              </div>
              <div className="col-4">
                <img style={{ width: "100%" }} src={user} />
              </div>
            </div>
          </div>
          <div className="box_card d-none d-lg-block">
            <div className="d-flex justify-content-between">
              <h5 className="mb-3">Recent Appointments</h5>
              <Button
                className="bg-dark text-white"
                onClick={() => navigate("/appointments")}
              >
                View All&nbsp;
                <FaArrowRightLong />
              </Button>
            </div>
            {/* Table for larger screens */}
            <div className="quotation-table">
              <Table
                loading={loading}
                columns={appointmentcolumn}
                dataSource={appointments}
                pagination={false}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="row">
            <div className="col-6 mb-4">
              <div className="box_card" onClick={() => navigate("/4")}>
                <div className="header">
                  <div className="iconDetail">
                    <div className="icon quote">
                      <FaCartShopping />
                    </div>
                    <span>Appointments</span>
                  </div>
                  <div className="buttonRedirect">
                    <FaArrowRightLong />
                  </div>
                </div>
                <div className="count">{analytics?.appointments}</div>
              </div>
            </div>
            <div className="col-6 mb-4">
              <div className="box_card" onClick={() => navigate("/5")}>
                <div className="header">
                  <div className="iconDetail">
                    <div className="icon order">
                      {" "}
                      <MdDashboard />
                    </div>
                    <span>Services</span>
                  </div>
                  <div className="buttonRedirect">
                    <FaArrowRightLong />
                  </div>
                </div>
                <div className="count">{analytics?.services}</div>
              </div>
            </div>
            <div className="col-6 mb-4">
              <div className="box_card" onClick={() => navigate("/2")}>
                <div className="header">
                  <div className="iconDetail">
                    <div className="icon user">
                      <FaUser />
                    </div>
                    <span>Users</span>
                  </div>
                  <div className="buttonRedirect">
                    <FaArrowRightLong />
                  </div>
                </div>
                <div className="count">{analytics?.users}</div>
              </div>
            </div>
            <div className="col-6 mb-4">
              <div className="box_card" onClick={() => navigate("/7")}>
                <div className="header">
                  <div className="iconDetail">
                    <div className="icon product">
                      <SiLibreofficewriter />
                    </div>
                    <span>Category</span>
                  </div>
                  <div className="buttonRedirect">
                    <FaArrowRightLong />
                  </div>
                </div>
                <div className="count">{analytics?.categories}</div>
              </div>
            </div>
          </div>
          <div className="box_card mt-2">
            <div className="d-flex justify-content-between">
              <h5 className="mb-3">Time Table</h5>
            </div>{" "}
            <List
              loading={loading}
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={days}
              renderItem={(item) => (
                <List.Item>
                  <div className="row w-100">
                    <div className="col-md-4">
                      <List.Item.Meta title={item} />
                    </div>
                    <div className="col-md-4 d-flex justify-content-center">
                      {item === "" ? (
                        <strong>Male</strong>
                      ) : timeTabel?.find(
                          (val) => val.type === "Male" && val.day === item
                        )?.status === "deactive" ? (
                        <span style={{ color: "red" }}>Closed</span>
                      ) : (
                        <span
                          style={{
                            textTransform: "uppercase",
                            fontSize: "12px",
                          }}
                        >
                          {
                            timeTabel?.find(
                              (val) => val.type === "Male" && val.day === item
                            )?.opening_time
                          }{" "}
                          -{" "}
                          {
                            timeTabel?.find(
                              (val) => val.type === "Male" && val.day === item
                            )?.closing_time
                          }
                        </span>
                      )}
                    </div>
                    <div className="col-md-4 d-flex justify-content-center">
                      {item === "" ? (
                        <strong>Female</strong>
                      ) : timeTabel?.find(
                          (val) => val.type === "Female" && val.day === item
                        )?.status === "deactive" ? (
                        <span style={{ color: "red" }}>Closed</span>
                      ) : (
                        <span
                          style={{
                            textTransform: "uppercase",
                            fontSize: "12px",
                          }}
                        >
                          {
                            timeTabel?.find(
                              (val) => val.type === "Female" && val.day === item
                            )?.opening_time
                          }{" "}
                          -{" "}
                          {
                            timeTabel?.find(
                              (val) => val.type === "Female" && val.day === item
                            )?.closing_time
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <div className="box_card mt-4 d-block d-lg-none">
            <div className="d-flex justify-content-between">
              <h5 className="mb-3">Recent Appointments</h5>
              <Button
                className="bg-dark text-white"
                onClick={() => navigate("/appointments")}
              >
                View All&nbsp;
                <FaArrowRightLong />
              </Button>
            </div>
            {/* Table for larger screens */}
            <div className="quotation-table">
              <Spin spinning={loading}>
                <CardListComp
                  type="garadge"
                  column={appointmentcolumn}
                  data={appointments}
                />
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
