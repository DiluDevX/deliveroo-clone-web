import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppSelector } from "../store/hooks/cartHooks";

const SignPageLayout = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);
  return <Outlet />;
};

export default SignPageLayout;
