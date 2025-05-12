import Header from "@/components/header";
import { Outlet } from "react-router";

const AppLayout = () => {
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
