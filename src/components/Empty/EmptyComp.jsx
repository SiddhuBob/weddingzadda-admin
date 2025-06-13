import { Empty } from "antd";
import React from "react";
import empty from "../../images/empty.avif"

export default function EmptyComp() {
  return (
    <div>
      <Empty
        image={empty}
        imageStyle={{
          height: 300,
        }}
        description={<h3>No data found !</h3>}
      />
    </div>
  );
}
