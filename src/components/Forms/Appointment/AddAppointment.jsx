import {
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  List,
  message,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { getToken } from "../../../services/localStorageServices";
import { get, post } from "../../../services/Base_Api";
import dayjs from "dayjs";
import moment from "moment";
import ListItemCart from "./ListItemCart";
import AddUserModal from "../../Modal/AddUserModal";
import CartDataModal from "../../Modal/CartDataModal";

export default function AddAppointment() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { setDrawerData, drawerData } = useDrawerContext();
  const [slots, setSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const onFinish = async (value) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("user_id", value.user_id);
      {
        selectedServices.map((val) => formData.append("service_id[]", val.id));
      }
      formData.append(
        "appointment_date",
        moment(value.appointment_date).format("YYYY-MM-DD")
      );
      formData.append("appointment_time", value.appointment_time);
      formData.append("appointment_status", "Success");
      formData.append(
        "subtotal",
        selectedServices
          .reduce((a, b) => a + parseFloat(b.price || 0), 0)
          .toFixed(2)
      );
      formData.append(
        "total",
        selectedServices
          .reduce((a, b) => a + parseFloat(b.price || 0), 0)
          .toFixed(2)
      );
      formData.append("remaining", 0);
      formData.append("tax", 0);

      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await post("/appointments", formData, header);

      if (resp) {
        addForm.resetFields();
        message.success("Added successfully!");
        setDrawerData((prev) => ({ ...prev, isOpen: false }));
        drawerData.refresh();
        setSelectedServices([]);
      }
    } catch (error) {
      message.error("Failed to add service! Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //   ==================== Get Slots ==============

  const getSlots = async (date) => {
    try {
      const header = {
        Authorization: `Bearer ${access_token}`,
      };
      const resp = await get(
        `/slots/${moment(new Date(date)).format(
          "dddd"
        )}?type=${addForm.getFieldValue("appointment_for")}&date=${moment(
          new Date(date)
        ).format("YYYY-MM-DD")}`,
        header
      );

      if (resp.message) {
        message.error(resp.message);
        setSlots([]);
      }

      if (resp) {
        setSlots(resp.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //   ======================== Get Services ==================

  const handleFetch = async (search) => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(
        `/services?page=${0}&limit=${10}${
          search !== "" ? "&search=" + search : ""
        }`,
        header
      );

      if (resp) {
        setServices(resp?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //   ======================== Get Users ==================
  const handleFetchUser = async (search) => {
    try {
      setLoading(true);
      const header = {
        Authorization: `Bearer ${access_token}`,
      };

      const resp = await get(
        `/users?page=${0}&limit=${10}${
          search !== "" ? "&search=" + search : ""
        }`,
        header
      );

      if (resp) {
        setUsers(resp?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    addForm.setFieldsValue({
      appointment_date: date,
    });
    getSlots(date);
  };

  const handleChnageType = (value) => {
    addForm.setFieldsValue({
      appointment_for: value,
    });
    getSlots(addForm.getFieldValue("appointment_date"));
  };

  //   ===================== Slots ==================

  useEffect(() => {
    addForm.setFieldsValue({
      appointment_date: dayjs(new Date()),
      appointment_for: "Male",
    });

    const dbounce = setTimeout(() => {
      getSlots(dayjs(new Date()));
    }, 300);

    return () => {
      clearTimeout(dbounce);
    };
  }, [drawerData]);

  // ============= Services ==============
  useEffect(() => {
    const dbounce = setTimeout(() => {
      handleFetch(search);
    }, 300);
    return () => clearTimeout(dbounce);
  }, [drawerData, search]);

  //   ============= Users ==============
  useEffect(() => {
    const dbounce = setTimeout(() => {
      handleFetchUser(searchUser);
    }, 300);
    return () => clearTimeout(dbounce);
  }, [drawerData, searchUser]);

  const formData = [
    {
      label: "Appointment Date",
      name: "appointment_date",
      form: (
        <DatePicker
          className="formInput w-100"
          format={"DD MMM YYYY"}
          onChange={(date) => handleDateChange(date)}
        />
      ),
      col: "col-12",
    },
    {
      label: "Appointment For",
      name: "appointment_for",
      form: (
        <Select
          placeholder="Select Appointment For"
          onChange={handleChnageType}
        >
          <Select.Option value={"Male"}>Male</Select.Option>
          <Select.Option value={"Female"}>Female</Select.Option>
        </Select>
      ),
      col: "col-12",
    },
    {
      label: "Appointment Slot",
      name: "appointment_time",
      form: (
        <Select placeholder="Select Available Slot">
          {slots.map((val, index) => (
            <Select.Option key={index} value={val}>
              {val}
            </Select.Option>
          ))}
        </Select>
      ),
      col: "col-12",
    },
    {
      label: "Select User",
      name: "user_id",
      form: (
        <Select
          showSearch
          onSearch={(val) => setSearchUser(val)}
          placeholder="Select Existing User"
        >
          {users.map((val, index) => (
            <Select.Option key={index} value={val.id}>
              {val.first_name} {val.last_name} - {val.phone_number}
            </Select.Option>
          ))}
        </Select>
      ),
      col: "col-9",
    },
    {
      label: " ",
      form: <AddUserModal handleFetchUser={handleFetchUser} />,
      col: "col-3",
    },
    {
      label: "Select Services",
      form: (
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search service..."
        />
      ),
      col: "col-9",
    },
    {
      label: " ",
      form: (
        <CartDataModal
          selectedServices={selectedServices}
          setSelectedServices={setSelectedServices}
        />
      ),
      col: "col-3",
    },

    {
      label: "",
      form: (
        <List
          itemLayout="horizontal"
          dataSource={services}
          renderItem={(val, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={
                  <ListItemCart
                    val={val}
                    selectedServices={selectedServices}
                    setSelectedServices={setSelectedServices}
                  />
                }
                description={
                  <div
                    className="d-flex justify-content-between"
                    style={{ marginLeft: "30px" }}
                  >
                    <div>{val?.sub_category?.name}</div>
                    <div>{val?.sub_category?.main_category?.name}</div>
                  </div>
                }
              />
            </List.Item>
          )}
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
