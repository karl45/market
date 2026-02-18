import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import Product from "../Products/Products";
import "./Main.scss";
import { useAuth } from "../../provider/AuthProvider";
import { useEffect } from "react";
import { API_URL } from "../../api";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";

interface MainProps {
  setShowLogout: (value: boolean) => void;
}

function Main({ setShowLogout }: MainProps) {
  const navigate = useNavigate();
  const auth = useAuth();
  const api = createLoginApiClient(auth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check");
        if (!res.ok) {
          navigate("/");
        } else {
          const csrf = await api.get('/csrf-token');
          const data = await csrf.json();
          auth.login({
            lpCsrfToken: data.csrfToken,
          });
          navigate("/products");
        }
      } catch (err) {
        console.error("Auth check failed", err);
        auth.logout();
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <div className="main">
        <Routes>
          <Route path="/" element={<Login setShowLogout={setShowLogout} />} />
          <Route path="/products" element={<Product />} />
        </Routes>
      </div>
    </>
  );
}

export default Main;
