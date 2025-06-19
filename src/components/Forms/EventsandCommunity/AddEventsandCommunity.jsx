import { Avatar, Button, Form, Image, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { useImageResizer } from "../../../context/ImageResizerProvider";
import { getToken } from "../../../services/localStorageServices";
import { post } from "../../../services/Base_Api";
import TextArea from "antd/es/input/TextArea";
import imageFallBack from "../../../images/thumbNail.jpg";

export default function AddEventsandCommunity() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { handleFileChange, files, setFiles } = useImageResizer();
  const { setDrawerData, drawerData } = useDrawerContext();

  const onFinish = async (value) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if(files){
      formData.append("image", files);
      }
      formData.append("name", value.name);
      formData.append("description", value.description);
      formData.append("type", value.type);

      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await post("https://api.weddingzadda.com/api/communities", formData, header);

      if (resp) {
        addForm.resetFields();
        message.success("Added successfully!");
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
          style={{ objectFit: "contain", width:"200px" }}
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
      label: "Slug",
      name: "slug",
      form: <Input className="formInput" placeholder="Slug" />,
      col: "col-12",
    },
    {
  label: "Type",
  name: "type",
  form: (
    <Select className="formInput" placeholder="Select Type">
      <Option value={0}>Events</Option>
      <Option value={1}>Community</Option>
    </Select>
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
