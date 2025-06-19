import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import Login from "./pages/login";
import LayoutContext from "./context/layout-context";
import NotFound from "./pages/404";
import Dashboard from "./pages/dashboard";
import { useSelector } from "react-redux";
import MainCategory from "./pages/MainCategory";
import SubCategory from "./pages/SubCategory";
import Services from "./pages/Services";
import TimeTable from "./pages/TimeTable";
import User from "./pages/User";
import Appointment from "./pages/Appointment";
import Vendors from "./pages/Vendors";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import Community from "./pages/Community";
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
<<<<<<< HEAD
import EventsandCommunity from "./pages/EventsandCommunity";
=======
import Community from "./pages/Community";
>>>>>>> 68d437804f0ecd50007781bd78bb45d1ad1e2402
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/dashboard"
            element={
              <LayoutContext>
                <Dashboard />
              </LayoutContext>
            }
          />
          <Route
            path="/appointments"
            element={
              <LayoutContext>
                <Appointment />
              </LayoutContext>
            }
          />

          <Route
            path="/main-categories"
            element={
              <LayoutContext>
                <MainCategory />
              </LayoutContext>
            }
          />
          <Route
            path="/sub-categories"
            element={
              <LayoutContext>
                <SubCategory />
              </LayoutContext>
            }
          />
          <Route
            path="/services"
            element={
              <LayoutContext>
                <Services />
              </LayoutContext>
            }
          />
          <Route
            path="/vendors"
            element={
              <LayoutContext>
                <Vendors />
              </LayoutContext>
            }
          />
          <Route
            path="/community"
            element={
              <LayoutContext>
                <Community />
              </LayoutContext>
            }
          />
          <Route
            path="/time-table"
            element={
              <LayoutContext>
                <TimeTable />
              </LayoutContext>
            }
          />
          <Route
            path="/eventsandcommunity"
            element={
              <LayoutContext>
                <EventsandCommunity />
              </LayoutContext>
            }
          />
          <Route
            path="/user"
            element={
              <LayoutContext>
                <User />
              </LayoutContext>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
