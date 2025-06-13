import { FaCheck, FaCartPlus } from "react-icons/fa";
import { Button } from "antd";
import { FaIndianRupeeSign } from "react-icons/fa6";

const ListItemCart = ({ val, selectedServices, setSelectedServices }) => {
  const isSelected = selectedServices.some((value) => value.id === val.id);

  return (
    <div className="d-flex align-items-baseline w-100">
      <Button
        disabled={isSelected}
        onClick={() => {
          if (!isSelected) {
            setSelectedServices((prev) => [...prev, val]); // Add only if not already selected
          }
        }}
        style={{
          width: "30px",
          height: "30px",
          marginRight: "10px",
        }}
        className={`${isSelected ? "bg-success" : "bg-dark"} text-white`}
        icon={isSelected ? <FaCheck /> : <FaCartPlus />}
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
  );
};


export default ListItemCart;