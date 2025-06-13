import React, { useEffect, useState } from "react";
import { getToken } from "../services/localStorageServices";
import PageHeader from "../components/PageHeader";
import DataLayoutComp from "../components/DataLayoutComp";
import { useDrawerContext } from "../context/FormDrawerProvider";
import { Button, message, Tag } from "antd";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { del, get } from "../services/Base_Api";
import moment from "moment";

export default function Services() {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(10);
  const [limit, setLimit] = useState(10);
  const [layoutView, setLayoutView] = useState("List");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { setDrawerData } = useDrawerContext();
  const [search, setSearch] = useState("");

  const column = [
    {
      title: "Day",
      key: "day",
      dataIndex: "day",
    },
    {
      title: "Duration",
      key: "duration",
      dataIndex: "duration",
      render: (text, record) => <span>{text} Min</span>,
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (text, record) => (
        <Tag
          color={text === "active" ? "green" : "red"}
          style={{ textTransform: "capitalize" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Opening Time",
      key: "opening_time",
      dataIndex: "opening_time",
      render: (text, record) =>text,
    },
    {
      title: "Closing Time",
      key: "closing_time",
      dataIndex: "closing_time",
      render: (text, record) =>text,
    },
    {
      title: "Modified At",
      key: "updated_at",
      dataIndex: "updated_at",
      render: (text, record) => moment(text).format("llll"),
    },
    {
      title: "Action",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="d-flex">
          <Button
            className="text-white bg-warning mx-3"
            icon={<FaEdit />}
            onClick={() => OpenUpdateForm(record)}
          />
          <Button
            className="text-white bg-danger"
            onClick={() => handleDelete(record.id)}
            icon={<FaTrash />}
          />
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
        `/slots?page=${page}&limit=${limit}${
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

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete ?")) {
        setLoading(true);
        const header = {
          Authorization: `Bearer ${access_token}`,
        };

        const resp = await del(`/slots/${id}`, header);

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
      title: "Add Slots",
      type: "SlotsAdd",
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
  }, [page, search]);

  const OpenUpdateForm = (value) => {
    setDrawerData({
      title: "Update Slots",
      type: "SlotsUpdate",
      width: 400,
      isOpen: true,
      value: value,
      refresh: () => handleFetch(""),
    });
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
