import WithPageTitle from "../hocs/WithPageTitle";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks/cartHooks";

const SignPageLayout = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <WithPageTitle title="SignPage">
      <Outlet />
    </WithPageTitle>
  );
};

export default SignPageLayout;
