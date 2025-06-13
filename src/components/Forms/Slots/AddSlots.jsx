import { Button, Form, InputNumber, message, Select, TimePicker } from "antd";
import React, { useState } from "react";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { getToken } from "../../../services/localStorageServices";
import { post } from "../../../services/Base_Api";
import moment from "moment";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const type = ["Male", "Female"];

export default function AddSlots() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { setDrawerData, drawerData } = useDrawerContext();

  const onFinish = async (value) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("day", value.day);
      formData.append("duration", value.duration);
      formData.append("type", value.type);
      formData.append("status", value.status);
         formData.append("opening_time", moment(new Date(value.opening_time)).format("hh:mm a"));
         formData.append("closing_time", moment(new Date(value.closing_time)).format("hh:mm a"));

      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await post("/slots", formData, header);

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
      label: "Day",
      name: "day",
      form: (
        <Select className="formInput" placeholder="Select Day">
          {days.map((val, index) => (
            <Select.Option key={index} value={val}>{val}</Select.Option>
          ))}
        </Select>
      ),
      col: "col-12",
    },
    {
      label: "Duration",
      name: "duration",
      form: (
        <InputNumber
          suffix="min"
          className="formInput w-100"
          placeholder="Duration"
        />
      ),
      col: "col-6",
    },
    {
      label: "Type",
      name: "type",
      form: (
        <Select showSearch placeholder="Select Type">
          {type.map((val, index) => (
            <Select.Option key={index} value={val}>{val}</Select.Option>
          ))}
        </Select>
      ),
      col: "col-6",
    },
    {
      label: "Opening Time",
      name: "opening_time",
      form: <TimePicker className="w-100" format={"hh:mm a"} />,
      col: "col-6",
    },
    {
      label: "Closing Time",
      name: "closing_time",
      form: <TimePicker className="w-100" format={"hh:mm a"} />,
      col: "col-6",
    },
    {
      label: "Slot Status",
      name: "status",
      form: (
        <Select placeholder="Slot Status">
          <Select.Option value={"active"}>Active</Select.Option>
          <Select.Option value={"deactive"}>Deactive</Select.Option>
        </Select>
      ),
      col: "col-12 w-100",
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
