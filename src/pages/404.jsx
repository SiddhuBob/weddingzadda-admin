import React, { useEffect } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { setUserToken } from "../features/authSlice";
import { getToken } from "../services/localStorageServices";
import { useDispatch } from "react-redux";
const NotFound = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {access_token} = getToken();

  const handleChange = () => {
    navigate("/");
    dispatch(setUserToken({ token: access_token }));
  };

  useEffect(() => {
    dispatch(setUserToken({ token: access_token }));
  }, [dispatch]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button onClick={handleChange} type="primary">
          Back Home
        </Button>
      }
    />
  );
};
export default NotFound;
