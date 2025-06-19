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
<<<<<<< Updated upstream
import AddCommunity from "../Forms/Community/AddCommunity";
=======
<<<<<<< HEAD
import AddEventsandCommunity from "../Forms/EventsandCommunity/AddEventsandCommunity";
=======
import AddCommunity from "../Forms/Community/AddCommunity";
>>>>>>> 68d437804f0ecd50007781bd78bb45d1ad1e2402
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        {drawerData.type === "communityAdd" && <AddCommunity />}
=======
<<<<<<< HEAD
        {drawerData.type === "EventsandCommunityAdd" && <AddEventsandCommunity />}
=======
        {drawerData.type === "communityAdd" && <AddCommunity />}
>>>>>>> 68d437804f0ecd50007781bd78bb45d1ad1e2402
>>>>>>> Stashed changes

        {/* not in use  */}
        {drawerData.type === "ServiceAdd" && <AddServices />}

      </Drawer>
    </>
  );
};
export default DrawerComp;
