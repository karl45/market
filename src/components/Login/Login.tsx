import { useState } from "react";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";

interface LoginProps extends LoadProps, AuthProps {
  setShowLogout: (value: boolean) => void;
}

function Login({ setShowLogout, auth, load }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const api = createLoginApiClient(auth, load);

  const onAuth = async () => {
    async function fetchLogin() {
      try {
        load.loading();
        const data = {
          userName: email,
          password: password,
        };
        const res = await api.post("/login", data);
        let res_data = await res.json();
        if (!res.ok) {
          setError(res_data);
        }
        await fetchCsrf(res_data);
      } catch (e) {
        load.loaded();
        console.error("Failed to fetch JWT token:", e);
        setError(String(e));
      }
    }

    async function fetchCsrf(res_data: any) {
      try {
        const update_csrf = await api.get("/csrf-token");

        if (!update_csrf.ok) {
          console.error("The CSRF was not created.");
          return;
        }
        const csrf = await update_csrf.json();
        auth.login({
          lpCsrfToken: csrf.csrfToken,
        });
        load.loaded();
        setShowLogout(true);
        navigate("/products");
      } catch (e) {
        console.error("Failed to fetch CSRF token:", e);
        load.loaded();
      }
    }
    await fetchLogin();
  };

  return (
    <div className="auth-form-block">
      <h2>Авторизация</h2>
      <div className="inputField">
        <span>Username:</span>
        <input onChange={onChangeEmail} type="email" />
      </div>
      <div className="inputField">
        <span>Password:</span>
        <input onChange={onChangePassword} type="password" />
      </div>
      <div className="buttonField">
        <button onClick={onAuth}>Login</button>
      </div>
      {error && (
        <div className="error_section">
          <h2>Auth failed</h2>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default Login;
