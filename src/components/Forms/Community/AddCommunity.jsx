import { Button, Form, Image, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { useImageResizer } from "../../../context/ImageResizerProvider";
import { getToken } from "../../../services/localStorageServices";
import TextArea from "antd/es/input/TextArea";
import imageFallBack from "../../../images/thumbNail.jpg";
import axios from "axios";

export default function AddCommunity() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken(); // Though not directly used in this snippet, keeping it for context
  const { handleFileChange, files, setFiles } = useImageResizer();
  const { setDrawerData, drawerData } = useDrawerContext();

  // Generate slug from name
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-")        // collapse whitespace and replace by -
      .replace(/-+/g, "-");        // collapse dashes

  // Handle change in name field to generate slug
  const handleValuesChange = (changedValues, allValues) => {
    if (changedValues.name) {
      const slug = generateSlug(changedValues.name);
      addForm.setFieldsValue({ slug });
    }
  };

  const onFinish = async (value) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (files) {
        formData.append("image", files);
      } else {
        message.error("Please upload an image.");
        setLoading(false);
        return; // Stop the function if no image is selected
      }
      formData.append("name", value.name);
      formData.append("description", value.description);
      formData.append("slug", value.slug);

      // IMPORTANT: Update this URL to your actual communities API endpoint
      const resp = await axios.post("https://api.woodsy.co.in/api/communities", formData);

      if (resp) {
        addForm.resetFields();
        message.success("Community added successfully!");
        setDrawerData((prev) => ({ ...prev, isOpen: false }));
        // Ensure drawerData.refresh is a function provided by your context
        if (drawerData.refresh) {
          drawerData.refresh();
        }
      }
    } catch (error) {
      message.error("Failed to add community! Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset files when drawer data changes (e.g., drawer closes/opens)
  useEffect(() => {
    setFiles(null);
    addForm.resetFields(); // Also reset form fields when drawer state changes
  }, [drawerData, setFiles, addForm]);

  return (
    <Form
      layout="vertical"
      form={addForm}
      onFinish={onFinish}
      onValuesChange={handleValuesChange}
    >
      <div className="row">
        <div className="col-12">
          <Form.Item label="Upload Image" name="image" rules={[{ required: true, message: "Please upload an image" }]}>
            <Input
              type="file"
              className="formInput form-control"
              placeholder="Image"
              onChange={(e) => handleFileChange(e, 1000)} // 1000 is max dimension
            />
          </Form.Item>
        </div>

        <div className="col-12">
          <Form.Item>
            <Image
              style={{ objectFit: "contain", width: "200px" }}
              src={files ? URL.createObjectURL(files) : ""}
              fallback={imageFallBack}
            />
          </Form.Item>
        </div>

        <div className="col-12">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input className="formInput" placeholder="Name" />
          </Form.Item>
        </div>

        <div className="col-12">
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea className="formInput" showCount placeholder="Description" />
          </Form.Item>
        </div>

        <div className="col-12">
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Slug is required" }]}
          >
            <Input className="formInput" placeholder="Slug" />
          </Form.Item>
        </div>

        <div className="col-12">
          <Form.Item>
            <Button
              loading={loading}
              htmlType="submit"
              className="bg-success w-100 text-white"
            >
              Submit
            </Button>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}