import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";

interface HeaderProps extends LoadProps, AuthProps {
  showLogout: boolean;
  setShowLogout: (value: boolean) => void;
}

function Header({ showLogout, setShowLogout, auth, load }: HeaderProps) {
  const navigate = useNavigate();
  const api = createLoginApiClient(auth);

  const onLogout = () => {
    async function fetchLogout() {
      try {
        load.loading();
        const logout = await api.post("/logout");
        if (!logout.ok) {
          load.loaded();
          console.log("Cannot logout");
        } else {
          load.loaded();
          auth.logout();
          setShowLogout(false);
          navigate("/");
        }
      } catch (e) {
        load.loaded();
        console.error("Failed to fetch JWT token:", e);
      }
    }
    fetchLogout();
  };

  return (
    <>
      <div className="head">
        <div className="black-box"></div>
        <div className="left_head">
          <h2 className="title">School Market</h2>
        </div>
        <div className="right_head">
          {showLogout && (
            <button
              onClick={onLogout}
              className={`logout ${showLogout ? "fadeIn" : "fadeOut"} `}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
