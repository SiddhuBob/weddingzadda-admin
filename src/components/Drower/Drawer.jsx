import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import { useDrawerContext } from "../../context/FormDrawerProvider";
import AddMainCategory from "../Forms/MainCategoryForm/AddMainCategory";
import UpdateMainCategory from "../Forms/MainCategoryForm/UpdateMainCategory";
import AddSubCategory from "../Forms/SubCategory/AddSubCategory";
import UpdateSubCategory from "../Forms/SubCategory/UpdateSubCategory";
import AddServices from "../Forms/Services/AddServices";
import UpdateServices from "../Forms/Services/UpdateServices";
import AddSlots from "../Forms/Slots/AddSlots";
import UpdateSlots from "../Forms/Slots/UpdateSlots";
import AddAppointment from "../Forms/Appointment/AddAppointment";
import AddVendor from "../Forms/Vendor/AddVendor";
import UpdateVendor from "../Forms/Vendor/UpdateVendor";
import AddCommunity from "../Forms/Community/AddCommunity";
import AddEventsandCommunity from "../Forms/EventsandCommunity/AddEventsandCommunity";

const DrawerComp = () => {
  const { drawerData, closedDrawer } = useDrawerContext();

  return (
    <>
      <Drawer
        title={drawerData.title}
        placement="right"
        width={drawerData.type === "enachCreate" ? 500 : 500}
        onClose={closedDrawer}
        open={drawerData.isOpen}
      >
        {drawerData.type === "AddMainCategory" && <AddMainCategory />}
        {drawerData.type === "UpdateMainCategory" && <UpdateMainCategory />}
        {drawerData.type === "AddSubCategory" && <AddSubCategory />}
        {drawerData.type === "UpdateSubCategory" && <UpdateSubCategory />}
        {drawerData.type === "serviceUpdate" && <UpdateServices />}
        {drawerData.type === "SlotsAdd" && <AddSlots />}
        {drawerData.type === "SlotsUpdate" && <UpdateSlots />}
        {drawerData.type === "AppointmentAdd" && <AddAppointment />}


        {/* new added  */}
        {drawerData.type === "VendorsAdd" && <AddVendor />}
        {drawerData.type === "vendorUpdate" && <UpdateVendor />}
        {drawerData.type === "communityAdd" && <AddCommunity />}
        {drawerData.type === "EventsandCommunityAdd" && <AddEventsandCommunity />}
        {drawerData.type === "ServiceAdd" && <AddServices />}

      </Drawer>
    </>
  );
};
export default DrawerComp;
