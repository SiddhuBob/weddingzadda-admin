import { message } from "antd";
import axios from "axios";

const BASE_URL = "https://api.weddingzadda.com/api/";
// const BASE_URL = "http://127.0.0.1:8000/api";

// Create Axios instance
const apiService = axios.create({
  baseURL: BASE_URL,
});

// Generic function to handle different HTTP methods with headers
const request = async (method, url, data = null, headers = {}) => {
  try {
    const response = await apiService({
      method,
      url,
      data,
      headers,
    });

    console.log("Success:", response.data);
    return response.data; // ✅ Return the API response properly
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
      message.error(
        error.response.data?.message ||
          "Something went wrong. Please try again."
      );
      throw new Error(error.response.data?.message || "Server Error"); // ✅ Throw error for caller function to handle
    } else {
      console.error("Network Error:", error.message);
      throw new Error("Network Error"); // ✅ Handle network errors
    }
  }
};

// Specific API functions using the generic request function
export const get = (url, headers = {}) => request("get", url, null, headers);

export const post = (url, data, headers = {}) =>
  request("post", url, data, headers);

export const put = (url, data, headers = {}) =>
  request("put", url, data, headers);

export const del = (url, headers = {}) => request("delete", url, null, headers);
