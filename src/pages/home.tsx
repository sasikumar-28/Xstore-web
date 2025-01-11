import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  return null;

};

export default Home;
