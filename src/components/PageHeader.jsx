import { Button, Tooltip } from "antd";
import React from "react";
import { LuRefreshCcwDot } from "react-icons/lu";

export default function PageHeader({ title, refreshData }) {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <h4>{title}</h4>
      <Tooltip title="Refresh">
        <Button onClick={refreshData} className="bg-success text-white">
          <LuRefreshCcwDot />
        </Button>
      </Tooltip>
    </div>
  );
}
