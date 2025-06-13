import { Button, Form, Image, Input, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDrawerContext } from "../../../context/FormDrawerProvider";
import { useImageResizer } from "../../../context/ImageResizerProvider";
import { getToken } from "../../../services/localStorageServices";
import { get, post } from "../../../services/Base_Api";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";

export default function AddVendor() {
  const [addForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { access_token } = getToken();
  const { handleFileChange, files, setFiles } = useImageResizer();
  const { setDrawerData, drawerData } = useDrawerContext();
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState(""); // Editor state
  const [featuresForm] = Form.useForm();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // const header = { Authorization: `Bearer ${access_token}` }; 
        const resp = await get(`/categories`);
        if (resp) {
          setCategory(resp);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        // const header = { Authorization: `Bearer ${access_token}` }; 
        const resp = await get(`/subcategories`);
        if (resp) {
          setSubCategory(resp);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const dbounce = setTimeout(fetchCategories, 300);
    const dbouncesub = setTimeout(fetchSubCategories, 300);
    return () => clearTimeout(dbounce,dbouncesub);
  }, [search]);

  // adding features

  const [features, setFeatures] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [featureForm] = Form.useForm();


  // Open modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    featureForm.resetFields();
  };

  // Handle form submission
  const handleFeatureSubmit = (values) => {
    setFeatures([...features, values]);
    handleCancel();
  };

  // Remove a feature by index
  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };


  // multiple images select album 
  const [albumFiles, setAlbumFiles] = useState([]);

  const handleAlbumFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setAlbumFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Store actual File objects
  };

  const removeAlbumFile = (index) => {
    setAlbumFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // adding price 
  // adding features

  const [price, setPrice] = useState([]);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [priceForm] = Form.useForm();


  // Open modal
  const showPriceModal = () => {
    setIsPriceModalVisible(true);
  };

  // Close modal
  const handlePriceCancel = () => {
    setIsPriceModalVisible(false);
    priceForm.resetFields();
  };

  // Handle form submission
  const handlePriceSubmit = (values) => {
    setPrice([...price, values]);
    handlePriceCancel();
  };

  // Remove a feature by index
  const removePrice = (index) => {
    setPrice(price.filter((_, i) => i !== index));
  };


  // api hit 

  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log("Starting API call..."); // Log before API call
      const formData = new FormData();
  
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      formData.append("text_editor", description);
      if (files instanceof File) {
        formData.append("cover_image", files);
      }
      features.forEach((feature, index) => {
        formData.append(`features[${index}][title]`, feature?.title);
        formData.append(`features[${index}][description]`, feature?.description);
      });
      price.forEach((prices, index) => {
        formData.append(`pricing[${index}][price_name]`, prices?.price_name);
        formData.append(`pricing[${index}][price_type]`, prices?.price_type);
        formData.append(`pricing[${index}][price_category]`, prices?.price_category);
        formData.append(`pricing[${index}][price]`, prices?.price);
      });

      albumFiles.forEach((file, index) => {
        formData.append(`images[]`, file); // Remove file.originFileObj
      });


      // const headers = {
      //   Authorization: `Bearer ${access_token}`,
      //   "Content-Type": "multipart/form-data",
      // };
  
      const resp = await post("vendors", formData);
  
      console.log("API call completed:", resp); // Log after API call
  
      if (resp) {
        setDrawerData((prev) => ({ ...prev, isOpen: false }));
        addForm.resetFields();
        setDescription("");
        setFiles(null);
        message.success("Vendor added successfully!");
        drawerData.refresh();
      }
    } catch (error) {
      console.error("API call failed:", error); // Log error
      message.error("Failed to add vendor. Please try again.");
    } finally {
      setLoading(false);
      console.log("Loading state reset."); // Log after loading state reset
    }
  };

  return (
    <>

      {/* step 1  */}
      <Form layout="vertical" form={addForm} onFinish={onFinish}
        initialValues={{ price_type: "fixed" }}
      >
        <h4>Vendor Service Details</h4>
        <Form.Item name="name" label="Vendor Name" rules={[{ required: true }]}>
          <Input placeholder="Enter Vendor Name" />
        </Form.Item>
        <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select Category" onSearch={setSearch} onChange={setSelectedCategory}>
            {category?.map((val) => (
              <Select.Option key={val.id} value={val.id}>{val.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="subcategory_id" label="Sub Category">
          <Select showSearch placeholder="Select Sub Category">
            {subCategory?.map((val) => (
              <Select.Option key={val.id} value={val.id}>{val.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="address1" label="Address 1" rules={[{ required: true }]}>
          <Input placeholder="Enter Address 1" />
        </Form.Item>
        <Form.Item name="address2" label="Address 2" rules={[{ required: true }]}>
          <Input placeholder="Enter Address 2" />
        </Form.Item>
        <Form.Item name="based_area" label="Based Area" rules={[{ required: true }]}>
          <Input placeholder="Based Area" />
        </Form.Item>
        <Form.Item name="short_description" label="Short Description" rules={[{ required: true }]}>
          <TextArea rows={3} placeholder="Short Description" />
        </Form.Item>
        <Form.Item name="map_url" label="Map Link" rules={[{ required: true }]}>
          <Input placeholder="Url For Map" />
        </Form.Item>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input placeholder="Enter State" />
        </Form.Item>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input placeholder="Enter City" />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Input placeholder="Enter Country" />
        </Form.Item>
        <Form.Item name="about_title" label="About Title" rules={[{ required: true }]}>
          <Input placeholder="Enter About Title" />
        </Form.Item>
        <Form.Item label="About Description">
          <ReactQuill theme="snow" value={description} onChange={setDescription} />
        </Form.Item>
        <Form.Item name="call_number" label="Call Number" rules={[{ required: true }]}>
          <Input placeholder="Enter Call Number" />
        </Form.Item>
        <Form.Item name="whatsapp_number" label="WhatsApp Number">
          <Input placeholder="Enter WhatsApp Number" />
        </Form.Item>
        <Form.Item name="mail_id" label="Email ID" rules={[{ type: "email", required: true }]}>
          <Input placeholder="Enter Email ID" />
        </Form.Item>
        <Form.Item name="cover_image" label="Cover Image">
          <Input type="file" onChange={(e) => handleFileChange(e, 1000)} />
        </Form.Item>
        {files && <Image style={{ objectFit: "contain", width: "200px" }} src={URL.createObjectURL(files)} />}


        {/* step 2 */}
        <div className="adding-features-main-con"
          style={{
            border: "1px solid #0000001a",
            margin: "20px 0px",
            borderRadius: "10px",
            padding: "20px",

          }}
        >
          <h3>Add Features</h3>
          <div className="addingfeatures">
            <Button onClick={showModal}
            // style={{ margin: "20px 0px" }}
            >
              Add Feature
            </Button>

            <Modal
              title="Add Feature"
              open={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form form={featureForm} onFinish={handleFeatureSubmit} layout="vertical">
                <Form.Item name="title" rules={[{ required: true, message: "Please enter title" }]}>
                  <Input placeholder="Feature Title" />
                </Form.Item>
                <Form.Item name="description" rules={[{ required: true, message: "Please enter description" }]}>
                  <Input placeholder="Feature Description" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Feature
                </Button>
              </Form>
            </Modal>

            {/* Display added features */}
            {features.map((feature, index) => (
              <div key={index} className="feature-item" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid black",
                padding: "10px",
              }}>
                <div className="feature-item-main-con">
                  <h3
                    style={{
                      fontSize: "12px",
                      margin: "0px"
                    }}
                  >{feature.title}</h3>
                  <p
                    style={{
                      margin: "0px"
                    }}
                  >{feature.description}</p>
                </div>
                <MdCancel onClick={() => removeFeature(index)} style={{ cursor: "pointer", color: "red", fontSize: "20px" }} />
              </div>
            ))}
          </div>
        </div>

        {/* step 3 */}

        <div className="adding-images"
          style={{
            border: "1px solid #0000001a",
            padding: "20px",
            margin: "20px 0px",
            borderRadius: "10px"

          }}
        >
          <h3> Add Album</h3>
          <Form layout="vertical">
            <Form.Item name="album_images" label="Album Images">
              <Input type="file" multiple accept="image/*" onChange={handleAlbumFileChange} />
            </Form.Item>
          </Form>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
  {albumFiles.length > 0 &&
    albumFiles.map((file, index) => (
      <div key={index} style={{ position: "relative", margin: "5px" }}>
        <Image
          style={{
            objectFit: "contain",
            width: "100px",
            height: "100px",
            border: "1px solid black",
            borderRadius: "10px",
          }}
          src={URL.createObjectURL(file)}
          alt={`album-image-${index}`}
        />
        <MdCancel
          onClick={() => removeAlbumFile(index)}
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            cursor: "pointer",
            color: "red",
            fontSize: "20px",
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        />
      </div>
    ))}
</div>
        </div>



        {/* step 3 */}

        <div className="adding-images"
          style={{
            border: "1px solid #0000001a",
            padding: "20px",
            margin: "20px 0px",
            borderRadius: "10px"

          }}
        >
          <h3>Add Price</h3>

          <div className="addingfeatures">
            <Button onClick={showPriceModal}
            // style={{ margin: "20px 0px" }}
            >
              Add Feature
            </Button>

            <Modal
              title="Add Price Types"
              open={isPriceModalVisible}
              onCancel={handlePriceCancel}
              footer={null}
            >
              <Form form={priceForm} onFinish={handlePriceSubmit} layout="vertical">
                <Form.Item name="price_name" rules={[{ required: true, message: "Please enter price name" }]}>
                  <Input placeholder="Enter Price Name" />
                </Form.Item>

                <Form.Item name="price_type" rules={[{ required: true, message: "Please select a price type" }]}>
                  <Select placeholder="Select Price Type">
                    <Select.Option value="package">Package</Select.Option>
                    <Select.Option value="price Info">Price Info</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="price_category" rules={[{ required: true, message: "Please enter price category" }]}>
                  <Input placeholder="Price Category" />
                </Form.Item>

                <Form.Item name="price" rules={[{ required: true, message: "Please enter price" }]}>
                  <Input placeholder="Price" />
                </Form.Item>

                <Button type="primary" htmlType="submit">
                  Add Feature
                </Button>
              </Form>
            </Modal>


            {/* Display added features */}
            {price.map((feature, index) => (
              console.log("lsdnvlsdv", price),
              <div key={index} className="feature-item" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid black",
                padding: "10px",
              }}>
                <div className="feature-item-main-con">
                  <h3
                    style={{
                      fontSize: "14px",
                      margin: "4px"
                    }}
                  >{feature.price_type}</h3>
                  <p
                    style={{
                      margin: "4px 0px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "17px",
                        color: "green",
                        fontWeight: "600",
                      }}
                    >{feature.price}</span>
                    <span
                      style={{
                        margin: "0px 10px",
                        fontSize: "12px",
                        color: "red",
                      }}
                    >( {feature.price_category} )</span>{feature.price_name}</p>
                </div>
                <MdCancel onClick={() => removePrice(index)} style={{ cursor: "pointer", color: "red", fontSize: "20px" }} />
              </div>
            ))}
          </div>
        </div>
        <Button loading={loading} htmlType="submit" className="bg-success w-100 text-white">Submit</Button>
      </Form>

    </>
  );
}
