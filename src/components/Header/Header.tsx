import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";

interface HeaderProps extends LoadProps, AuthProps {
  showLogout: boolean;
  setShowLogout: (value: boolean) => void;
} 

function Header({ showLogout, setShowLogout , auth, load }: HeaderProps) {
 
  const navigate = useNavigate();
  const api = createLoginApiClient(auth, load);

  const onLogout = () => {
    async function fetchLogout() {
      try {
        const logout = await api.post("/logout");
        if (!logout.ok) {
          console.log("Cannot logout");
        } else {
          setShowLogout(false);
          navigate("/");
        }
      } catch (e) {
        console.error("Failed to fetch JWT token:", e);
      }
    }
    fetchLogout();
  };

  return (
    <>
      <div className="head">
        <div className="left_head">
          <h2 className="title">Market</h2>
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
