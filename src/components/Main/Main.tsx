import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import Product from "../Products/Products";
import "./Main.scss";
import { useEffect } from "react";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";

interface MainProps extends LoadProps, AuthProps {
  setShowProfileSection: (value: boolean) => void;
}

function Main({ setShowProfileSection, auth, load }: MainProps) {
  const navigate = useNavigate();
  const api = createLoginApiClient(auth);

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
    <div className={`main${!auth.isAuth ? ' state1' : ''}`}>
      {load.getLoading() && (
        <div className="global_loading_wrapper">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Maple_leaf_--_NDP.svg/250px-Maple_leaf_--_NDP.svg.png"
            alt=""
          />
        </div>
      )}
      {!load.getLoading() && (
        <Routes>
          <Route path="/" element={<Login auth={auth} load={load} setShowLogout={setShowProfileSection} />} />
          <Route
            path="/products"
            element={<Product auth={auth} />}
          />
        </Routes>
      )}
    </div>
  );
}

export default Main;
