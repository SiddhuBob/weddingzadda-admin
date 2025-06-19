import React, { useEffect, useState } from 'react'
import { getToken } from "../services/localStorageServices";
import PageHeader from "../components/PageHeader";
import DataLayoutComp from "../components/DataLayoutComp";

import { Button, Image, message } from "antd";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { del, get, post } from "../services/Base_Api";
import moment from "moment";
import fallback from "../images/thumbNail.jpg";
import { useDrawerContext } from "../context/FormDrawerProvider";

const EventsandCommunity = () => {
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(10);
    const [limit, setLimit] = useState(10);
    const [layoutView, setLayoutView] = useState("List");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { access_token } = getToken();
    const { setDrawerData } = useDrawerContext();
    const [search, setSearch] = useState("");
  console.log("data",data)
    const column = [
      {
        title: "Image",
        key: "image_url",
        dataIndex: "image_url",
        render: (text, record) => (
          <Image
            src={record?.image_url}
            alt={record?.name}
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
        title: "Slug",
        key: "slug",
        dataIndex: "slug",
        
      },
     {
  title: "Type",
  key: "Type",
  dataIndex: "type",
  render: (value) => (value === "0" ? "Events" : "Community"),
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
  
        // const resp = await get(
        //   `/vendors?page=${page}&limit=${limit}${
        //     search !== "" ? "&search=" + search : ""
        //   }`,
        //   header
        // );
        const resp = await get(
          `/communities`
        );
        if (resp) {
          setData(resp);
          // setTotal(resp?.pagination?.total);
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
          // const header = {
          //   Authorization: `Bearer ${access_token}`,
          // };
  
          const resp = await del(`/communities/${id}`);
  
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
        title: "Add Events And Communities",
        type: "EventsandCommunityAdd",
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
        title: "Update Vendor",
        type: "vendorUpdate",
        width: 400,
        isOpen: true,
        value: value,
        refresh: () => handleFetch(""),
      });
    };
  
    return (
      <div>
        <PageHeader
          title={"vendors"}
          refreshData={() => handleFetch(search)}
        />
        <DataLayoutComp
          title="Vendors"
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

export default EventsandCommunity