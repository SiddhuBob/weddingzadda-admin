import React, { useEffect, useState } from "react";
import { getToken } from "../services/localStorageServices";
import PageHeader from "../components/PageHeader";
import DataLayoutComp from "../components/DataLayoutComp";
import { Dropdown, Tag } from "antd";
import { del, get, post } from "../services/Base_Api";
import moment from "moment";
import { FaAngleDown } from "react-icons/fa";
import UserBoookingList from "../components/Modal/UserBoookingList";

export default function User() {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(10);
  const [limit, setLimit] = useState(10);
  const [layoutView, setLayoutView] = useState("List");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const [search, setSearch] = useState("");

  const items = [
    {
      key: "1",
      label: "Normal",
      value: "Normal",
    },
    {
      key: "2",
      label: "VVIP",
      value: "VVIP",
    },
    {
      key: "3",
      label: "VIP",
      value: "VIP",
    },
    {
      key: "4",
      label: "Black List",
      value: "Black List",
    },
  ];

  const column = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      render: (text, record) => (
        <span>{record.first_name + " " + record.last_name}</span>
      ),
    },
    {
      title: "Phone Number",
      key: "phone_number",
      dataIndex: "phone_number",
      render: (text, record) => <span>+91 {text}</span>,
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Email",
      key: "gender",
      dataIndex: "gender",
    },
    {
      title: "Bookmark",
      key: "status",
      dataIndex: "status",
      render: (text, record) => (
        <Dropdown
          style={{ textTransform: "capitalize", cursor: "pointer" }}
          menu={{
            items: items
              .filter((val) => val.value !== text)
              .map((val) => ({
                key: val.key,
                label: val.label,
                onClick: () => handleStatusChange(record.id, val.value),
              })),
          }}
        >
          <Tag
            color={
              text === "Normal"
                ? "blue"
                : text === "VVIP"
                ? "success"
                : text === "VIP"
                ? "orange"
                : "red"
            }
            style={{ textTransform: "capitalize", cursor: "pointer" }}
          >
            {text}&nbsp;
            <FaAngleDown />
          </Tag>
        </Dropdown>
      ),
    },
    {
      title: "Bookings",
      key: "bookings",
      dataIndex: "bookings",
      render: (text, record) => (
        <UserBoookingList
          userId={record?.id}
          bookings={record?.appointments?.length}
        />
      ),
    },
    {
      title: "Modified At",
      key: "updated_at",
      dataIndex: "updated_at",
      render: (text, record) => moment(text).format("llll"),
    },
  ];

  const handleFetch = async (search) => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(
        `/users?page=${page}&limit=${limit}${
          search !== "" ? "&search=" + search : ""
        }`,
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

  useEffect(() => {
    const dbounce = setTimeout(() => {
      handleFetch(search);
    }, 300);

    return () => clearTimeout(dbounce);
  }, [page, search]);

  // ============= Update Status ==============

  const handleStatusChange = async (id, status) => {
    if (window.confirm("Are you sure you want to change the status?")) {
      try {
        setLoading(true);
        const header = {
          Authorization: `Bearer ${access_token}`,
        };

        const formData = new FormData();
        formData.append("status", status);
        formData.append("_method", "PUT");

        const resp = await post(`/users-status-update/${id}`, formData, header);

        if (resp) {
          handleFetch(search);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <PageHeader
        title={"Time Slots"}
        refreshData={() => handleFetch(search)}
      />
      <DataLayoutComp
        title="Time Slots"
        total={total}
        page={page}
        setPage={setPage}
        setLimit={setLimit}
        setLayoutView={setLayoutView}
        OpenAddForm={false}
        column={column}
        data={data}
        layoutView={layoutView}
        loading={loading}
        setSearch={setSearch}
      />
    </div>
  );
}
