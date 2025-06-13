import React from "react";
import "../css/CardList.css";
import EmptyComp from "./Empty/EmptyComp";

export default function CardListComp({ type, data, column }) {
  return (
    <div className="row">
      {data?.length > 0 ? (
        data.map((value, i) => (
          console.log("value",value),
          <div className="col-xl-4 col-lg-6 col-12 mx-2 mb-3" key={i}>
            <div className="card w-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between bg-light-200 rounded p-2 mb-3">
                  <div className="d-flex align-items-center">
                    <div>
                      {/* {column
                        .find((col) => col.key === "image")
                        ?.render?.(null, value)} */}
                    </div>
                  </div>
                  <div className="dropdown table-action">
                    {/* Render the "action" column */}
                    {column
                      .find((col) => col.key === "action")
                      ?.render?.(null, value)}
                  </div>
                </div>

                <div className="mb-3 d-flex flex-column">
                  {/* Loop through columns to display values */}
                  {column
                    .filter((val) => val.key !== "action")
                    .map((val) => (
                      <p
                        className="text-default d-inline-flex align-items-center mb-2"
                        key={val.key}
                      >
                        {val.key !== "image" && (
                          <strong>{val.title}:&nbsp;</strong>
                        )}
                        {val.render
                          ? /* Render using the column's custom render method */
                            val.render(value[val.dataIndex], value)
                          : /* Render default values */
                            value[val.dataIndex]}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <EmptyComp />
      )}
    </div>
  );
}
