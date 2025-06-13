import { Badge, Button, Form, Input, message, Modal, Select } from "antd";
import React, { useState } from "react";
import { getToken } from "../../services/localStorageServices";
import { post } from "../../services/Base_Api";
import { FaEnvelope, FaUserAlt } from "react-icons/fa";

export default function AddUserModal({ handleFetchUser }) {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (value) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("first_name", value.first_name);
      formData.append("last_name", value.last_name);
      formData.append("phone_number", value.phone_number);
      formData.append("email", value.email);
      formData.append("gender", value.gender);
      formData.append("role", "user");

      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await post("/register", formData, header);

      if (resp) {
        addForm.resetFields();
        message.success("Added successfully!");
        handleFetchUser("");
        setIsModalOpen(false);
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
      label: "First Name",
      name: "first_name",
      form: (
        <Input type="text" className="formInput" placeholder="First Name" />
      ),
      col: "col-6",
    },
    {
      label: "Last Name",
      name: "last_name",
      form: <Input type="text" className="formInput" placeholder="Last Name" />,
      col: "col-6",
    },
    {
      label: "Phone Number",
      name: "phone_number",
      form: (
        <Input
          prefix="+91"
          className="formInput w-100"
          placeholder="Phone Number"
        />
      ),
      col: "col-12",
    },
    {
      label: "Email ID",
      name: "email",
      form: (
        <Input
          prefix={<FaEnvelope />}
          className="formInput w-100"
          placeholder="Email ID"
        />
      ),
      col: "col-12",
    },
    {
      label: "Gender",
      name: "gender",
      form: (
        <Select
          className="w-100"
          placeholder={"Select Gender"}
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
          ]}
        />
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

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        className="bg-success text-white"
        onClick={showModal}
        icon={<FaUserAlt />}
      >
        Add User
      </Button>
      <Modal
        title="Create User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered
      >
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
      </Modal>
    </>
  );
}
