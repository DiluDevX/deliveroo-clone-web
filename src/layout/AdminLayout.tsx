import Footer from "../features/menu/components/Footer";
import { Outlet } from "react-router-dom";
import Header from "../features/menu/components/Header";

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        overflow: "visible",
      }}
    >
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AdminLayout;
