import React, { useEffect, useState } from "react";
import { getToken } from "../services/localStorageServices";
import PageHeader from "../components/PageHeader";
import DataLayoutComp from "../components/DataLayoutComp";
import { useDrawerContext } from "../context/FormDrawerProvider";
import { Button, Image, message, Popover, Tag } from "antd";
import { FaAngleDown, FaCheck, FaCross, FaEdit } from "react-icons/fa";
import { FaIndianRupeeSign, FaTrash } from "react-icons/fa6";
import { del, get, post } from "../services/Base_Api";
import moment from "moment";
import fallback from "../images/thumbNail.jpg";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";

export default function Appointment() {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(10);
  const [limit, setLimit] = useState(10);
  const [layoutView, setLayoutView] = useState("List");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { setDrawerData } = useDrawerContext();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));

  const column = [
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
      title: "Bookmark",
      key: "bookmark",
      dataIndex: "bookmark",
      render: (text, record) => (
        <Tag
          color={
            record?.user?.status === "Normal"
              ? "blue"
              : record?.user?.status === "VVIP"
              ? "success"
              : record?.user?.status === "VIP"
              ? "orange"
              : "red"
          }
          style={{ textTransform: "capitalize", cursor: "pointer" }}
        >
          {record?.user?.status}
        </Tag>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      dataIndex: "phone",
      render: (text, record) => record?.user?.phone_number,
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      render: (text, record) => record?.user?.email,
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
            {record?.services?.length}&nbsp;Services&nbsp;<FaAngleDown />
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
    {
      title: "Total",
      key: "total",
      dataIndex: "total",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <FaIndianRupeeSign style={{ fontSize: ".85rem" }} />
          &nbsp;
          {text}
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) =>
        record.appointment_status === "Success" && (
          <div className="">
            <Button
              className="text-white bg-success"
              onClick={() => handleUpdate(record.id)}
              icon={<FaCheck />}
            >
              Completed
            </Button>
            <Button
              className="text-white bg-danger"
              onClick={() => handleDelete(record.id)}
              icon={<IoClose />}
            >
              Cancel
            </Button>
          </div>
        ),
    },
  ];

  const handleFetch = async (search) => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(
        `/appointments?page=${page}&limit=${limit}&date=${moment(
          new Date(selectedDate)
        ).format("YYYY-MM-DD")}${search !== "" ? "&search=" + search : ""}`,
        header
      );

      if (resp) {
        setData(resp?.data);
        setTotal(resp?.pagination?.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to cancelled ?")) {
        setLoading(true);
        const header = {
          Authorization: `Bearer ${access_token}`,
        };

        const resp = await del(`/appointments/${id}`, header);

        if (resp) {
          handleFetch("");
          message.success("Cancelled successfull");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      if (window.confirm("Is service completed ?")) {
        setLoading(true);
        const header = {
          Authorization: `Bearer ${access_token}`,
        };

        const formData = new FormData();
        formData.append("appointment_status", "Completed");
        formData.append("_method", "PUT");

        const resp = await post(`/appointments/${id}`, formData, header);

        if (resp) {
          handleFetch("");
          message.success("Deleted successfull");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const OpenAddForm = () => {
    setDrawerData({
      title: "Create Appointment",
      type: "AppointmentAdd",
      width: 400,
      isOpen: true,
      refresh: () => handleFetch(""),
    });
  };

  useEffect(() => {
    const dbounce = setTimeout(() => {
      handleFetch(search);
    }, 300);

    return () => clearTimeout(dbounce);
  }, [page, search, selectedDate]);

  const OpenUpdateForm = (value) => {
    setDrawerData({
      title: "Update Categories",
      type: "UpdateMainCategory",
      width: 400,
      isOpen: true,
      value: value,
      refresh: () => handleFetch(""),
    });
  };

  return (
    <div>
      <PageHeader
        title={"All Appointments"}
        refreshData={() => handleFetch(search)}
      />
      <DataLayoutComp
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        title="Appointments"
        total={total}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        setLayoutView={setLayoutView}
        OpenAddForm={OpenAddForm}
        column={column}
        data={data}
        layoutView={layoutView}
        loading={loading}
        setSearch={setSearch}
      />
    </div>
  );
}
