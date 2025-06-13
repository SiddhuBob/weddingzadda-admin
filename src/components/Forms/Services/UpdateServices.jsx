import { Button, Form, Image, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { useImageResizer } from "../../../context/ImageResizerProvider";
import { getToken } from "../../../services/localStorageServices";
import { get, post } from "../../../services/Base_Api";
import TextArea from "antd/es/input/TextArea";
import imageFallBack from "../../../images/thumbNail.jpg";
import { FaIndianRupeeSign } from "react-icons/fa6";

export default function UpdateServices() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { handleFileChange, files, setFiles } = useImageResizer();
  const { setDrawerData, drawerData } = useDrawerContext();
  const [category, setCatregory] = useState([]);
  const [search, setSearch] = useState("");

  const handleFetch = async (search) => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(
        `/categories?page=${0}&limit=${10}${
          search !== "" ? "&search=" + search : ""
        }`,
        header
      );

      if (resp) {
        setCatregory(resp?.data);
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
    });

    return () => clearTimeout(dbounce);
  }, [search]);

  const onFinish = async (value) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (files) {
        formData.append("image", files);
      }
      formData.append("name", value.name);
      formData.append("price", value.price);
      formData.append("description", value.description);
      formData.append("category_id", value.category_id);
      formData.append("_method", "PUT");

      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await post(`/services/${value.id}`, formData, header);

      if (resp) {
        addForm.resetFields();
        message.success("Updated successfully!");
        setDrawerData((prev) => ({ ...prev, isOpen: false }));
        drawerData.refresh();
      }
    } catch (error) {
      message.error("Failed to add service! Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const formData = [
    {
      label: "Upload Image",
      name: "id",
      form: (
        <Input
          type="text"
          className="formInput form-control"
          placeholder="Image"
        />
      ),
      col: "col-12 d-none",
    },
    {
      label: "Upload Image",
      form: (
        <Input
          type="file"
          className="formInput form-control"
          placeholder="Image"
          onChange={(e) => handleFileChange(e, 1000)}
        />
      ),
      col: "col-12",
    },
    {
      label: "",
      form: (
        <Image
          style={{ objectFit: "contain", width: "200px" }}
          src={files ? URL.createObjectURL(files) : ""}
          fallback={imageFallBack}
        />
      ),
      col: "col-12",
    },
    {
      label: "Name",
      name: "name",
      form: <Input className="formInput" placeholder="Name" />,
      col: "col-12",
    },
    {
      label: "Price",
      name: "price",
      form: (
        <Input
          className="formInput"
          prefix={<FaIndianRupeeSign />}
          placeholder="Price"
        />
      ),
      col: "col-12",
    },
    {
      label: "Description",
      name: "description",
      form: (
        <TextArea className="formInput" showCount placeholder="Description" />
      ),
      col: "col-12",
    },
    {
      label: "Select Category",
      name: "category_id",
      form: (
        <Select
          showSearch
          placeholder="Select categrory"
          onSearch={(value) => setSearch(value)}
        >
          {category.map((val) => (
            <Select.Option value={val.id}>{val.name}</Select.Option>
          ))}
        </Select>
      ),
      col: "col-12",
    },
    {
      label: "",
      form: (
        <Button
          loading={loading}
          htmlType="submit"
          className="bg-success w-100 text-white"
        >
          Submit
        </Button>
      ),
    },
  ];

  useEffect(() => {
    setFiles(null);

    if (drawerData) {
      addForm.setFieldsValue(drawerData.value);
    }
    
  }, [drawerData]);

  return (
    <Form layout="vertical" form={addForm} onFinish={onFinish}>
      <div className="row">
        {formData.map((val) => (
          <div className={val.col}>
            <Form.Item
              rules={[
                {
                  required: true,
                },
              ]}
              name={val.name}
              label={val.label}
            >
              {val.form}
            </Form.Item>
          </div>
        ))}
      </div>
    </Form>
  );
}
