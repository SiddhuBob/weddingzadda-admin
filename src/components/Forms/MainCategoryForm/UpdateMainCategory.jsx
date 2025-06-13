import { Button, Form, Image, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { useImageResizer } from "../../../context/ImageResizerProvider";
import { getToken } from "../../../services/localStorageServices";
import { post, put } from "../../../services/Base_Api";
import TextArea from "antd/es/input/TextArea";
import imageFallBack from "../../../images/thumbNail.jpg";
import axios from "axios";

export default function UpdateMainCategory() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { handleFileChange, files, setFiles } = useImageResizer();
  const { setDrawerData, drawerData } = useDrawerContext();

  const onFinish = async (value) => {
    try {
      setLoading(true);
  
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("description", value.description);
      if (files) {
        formData.append("image", files); // `files` is a File object
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          // Do NOT set Content-Type manually when using FormData
        },
      };
  
      const resp = await axios.post(
        `https://api.weddingzadda.com/api/categories/${value.id}`,
        formData,
        config
      );
  
      if (resp) {
        addForm.resetFields();
        message.success("Updated successfully!");
        setDrawerData((prev) => ({ ...prev, isOpen: false }));
        drawerData.refresh();
      }
    } catch (error) {
      message.error("Failed to update! Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  


  // const onFinish = async (value) => {
  //   try {
  //     setLoading(true);
  
  //     const formData = new FormData();
  //     formData.append("name", value.name);
  //     formData.append("description", value.description);
  //     formData.append("id", value.id);
  //     if (files) {
  //       formData.append("image", files); // `files` is a File object
  //     }
  
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //         // Let Axios set the content-type for FormData
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //     };
  
  //     const resp = await axios.patch(
  //       `https://api.weddingzadda.com/api/categories/${value.id}`,
  //       formData,
  //       config
  //     );
  
  //     if (resp) {
  //       addForm.resetFields();
  //       message.success("Updated successfully!");
  //       setDrawerData((prev) => ({ ...prev, isOpen: false }));
  //       drawerData.refresh();
  //     }
  //   } catch (error) {
  //     message.error("Failed to update! Please try again.");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  
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
          src={files ? URL.createObjectURL(files) : drawerData?.value?.image}
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

    if (drawerData) {
      addForm.setFieldsValue(drawerData.value);
    }
  }, [drawerData]);

  return (
    <Form layout="vertical" form={addForm} onFinish={onFinish}>
      <div className="row">
        {formData?.map((val) => (
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
