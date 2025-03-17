import Navbar from "@/components/custom/Navbar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <>
      <Header />
      <main className="bg-[#FAFAFA] h-full">
        <Navbar />
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AppLayout;
