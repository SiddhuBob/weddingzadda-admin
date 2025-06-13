import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Segmented,
  Spin,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import "../css/Table.css";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoList } from "react-icons/io5";
import { IoGridSharp } from "react-icons/io5";
import CardListComp from "./CardListComp";
import moment from "moment";

export default function DataLayoutComp({
  title,
  total,
  page,
  setPage,
  setLimit,
  setLayoutView,
  OpenAddForm,
  column,
  data,
  layoutView,
  loading,
  setSearch,
  selectedDate,
  setSelectedDate,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 990);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 990); // Update state for mobile breakpoint
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="table_comp">
      <div className="container">
        <div className="table_head">
          <div className="d-flex">
            <Input
              className="form_input"
              placeholder="Search Here.."
              prefix={<FiSearch />}
              onChange={(e) => setSearch(e.target.value)}
            />
            {selectedDate && (
              <DatePicker
                value={selectedDate} // Use moment() directly
                format={"DD MMM YYYY"}
                style={{ minWidth: "200px", marginLeft: 10 }}
                onChange={setSelectedDate}
              />
            )}
          </div>

          <div className="right_buttons mb-4 d-flex">
            <Segmented
              className="type_select mx-3"
              onChange={setLayoutView}
              value={isMobile ? "Grid" : layoutView}
              options={[
                {
                  value: "List",
                  icon: <IoList />,
                },
                {
                  value: "Grid",
                  icon: <IoGridSharp />,
                },
              ]}
            />
            {OpenAddForm && (
              <Button
                className="add_button"
                onClick={OpenAddForm}
                icon={<IoMdAddCircleOutline />}
              >
                Add {title}
              </Button>
            )}
          </div>
        </div>

        {!isMobile && layoutView === "List" ? (
          <Table
            loading={loading}
            columns={column}
            dataSource={data}
            pagination={false}
          />
        ) : (
          <Spin spinning={loading}>
            <CardListComp type="garadge" column={column} data={data} />
          </Spin>
        )}
        <Pagination
          hideOnSinglePage
          className="mt-4"
          total={total}
          current={page}
          onChange={(page, limit) => {
            setPage(page);
            setLimit(limit);
          }}
        />
      </div>
    </div>
  );
}
