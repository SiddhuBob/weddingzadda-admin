import React, { useEffect, useState } from "react";
import { getToken } from "../services/localStorageServices";
import PageHeader from "../components/PageHeader";
import DataLayoutComp from "../components/DataLayoutComp";
import { useDrawerContext } from "../context/FormDrawerProvider";
import { Button, Image, message } from "antd";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { del, get, post } from "../services/Base_Api";
import moment from "moment";
import fallback from "../images/thumbNail.jpg";

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
      title: "Image",
      key: "image",
      dataIndex: "image",
      render: (text, record) => (
        <Image
          src={text}
          fallback={fallback}
          style={{ width: 100, objectFit: "contain" }}
        />
      ),
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Sub Category",
      key: "sub_category",
      dataIndex: "sub_category",
      width: "15%",
      render: (text, record) => <>{record?.sub_category?.name}</>,
    },
    {
      title: "Main Category",
      key: "main_category",
      dataIndex: "main_category",
      width: "15%",
      render: (text, record) => <>{record?.sub_category?.main_category?.name}</>,
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
      render: (text, record) => <p className="desc_control">{text}</p>,
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
        `/services?page=${page}&limit=${limit}${
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

        const resp = await del(`/services/${id}`, header);

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
      title: "Add Service",
      type: "ServiceAdd",
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
      title: "Update Service",
      type: "serviceUpdate",
      width: 400,
      isOpen: true,
      value: value,
      refresh: () => handleFetch(""),
    });
  };

  return (
    <div>
      <PageHeader
        title={"Services"}
        refreshData={() => handleFetch(search)}
      />
      <DataLayoutComp
        title="Services"
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
