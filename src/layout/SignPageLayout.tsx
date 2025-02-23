import WithPageTitle from "../hocs/WithPageTitle";
import { Outlet } from "react-router-dom";

const SignPageLayout = () => {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/";
  }
  return (
    <WithPageTitle title="SignPage">
      <Outlet />
    </WithPageTitle>
  );
};

export default SignPageLayout;
