import Header from "@/components/header";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const AppLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const customerId = localStorage.getItem("customerId");
    if (!customerId) {
      navigate("/login");
    }
    if (window.location.pathname === "/login") {
      localStorage.removeItem("customerId");
    }
    if (window.location.pathname === "/") {
      navigate("/DocumentGeneration?storeCode=aspiresys-ai-sales-docGen");
    }
  }, []);
  return (
    <>
      <Header />
      <main className="bg-[#FAFAFA] h-full flex">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default AppLayout;
