import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import Product from "../Products/Products";
import "./Main.scss";
import { useEffect } from "react";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";

interface MainProps extends LoadProps, AuthProps {
  setShowLogout: (value: boolean) => void;
}

function Main({ setShowLogout, auth, load }: MainProps) {
  const navigate = useNavigate();
  const api = createLoginApiClient(auth, load);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        load.loading();
        const res = await api.get("/check");
        if (res.ok) {
          const csrf = await api.get("/csrf-token");
          const data = await csrf.json();
          auth.login({
            lpCsrfToken: data.csrfToken,
          });
          load.loaded();
        }
      } catch (e) {
        auth.logout();
        load.loaded();
        navigate("/");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (auth.isAuth) {
      navigate("/products");
    } else {
      navigate("/");
    }
  }, [auth.isAuth]);

  return (
    <div className="main">
      {load.getLoading() && (
        <div className="global_loading_wrapper">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu1tHazu6pQAkaHEZaNkssmnPvMaEukaMtRQ&s"
            alt=""
          />
        </div>
      )}
      {!load.getLoading() && (
        <Routes>
          <Route path="/" element={<Login auth={auth} load={load} setShowLogout={setShowLogout} />} />
          <Route
            path="/products"
            element={<Product auth={auth} load={load} />}
          />
        </Routes>
      )}
    </div>
  );
}

export default Main;
