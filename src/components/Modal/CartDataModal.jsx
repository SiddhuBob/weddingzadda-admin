import { Badge, Button, List, Modal } from "antd";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoCart } from "react-icons/io5";

export default function CartDataModal({
  selectedServices,
  setSelectedServices,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <Badge showZero count={selectedServices.length}>
        <Button
          onClick={showModal}
          className="bg-success text-white"
          icon={<IoCart />}
        >
          Cart
        </Button>
      </Badge>
      <Modal
        title="Create User"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedServices}
          renderItem={(val, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={
                  <div className="d-flex align-items-baseline w-100">
                    <Button
                      onClick={() =>
                        setSelectedServices(
                          (prev) => prev.filter((value) => value.id !== val.id) // Removes the selected service
                        )
                      }
                      style={{
                        width: "30px",
                        height: "30px",
                        marginRight: "10px",
                      }}
                      className={`${"bg-danger"} text-white`}
                      icon={<FaTrash />}
                    />
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <h5 style={{ fontSize: "0.9rem" }}>{val.name}</h5>
                      <h6 style={{ fontSize: "0.8rem" }}>
                        <FaIndianRupeeSign />
                        &nbsp;
                        {val.price}
                      </h6>
                    </div>
                  </div>
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
      </Modal>
    </>
  );
}
