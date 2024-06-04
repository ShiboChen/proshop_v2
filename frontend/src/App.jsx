import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Header />
      <div className="w-4/5 mx-auto min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default App;
