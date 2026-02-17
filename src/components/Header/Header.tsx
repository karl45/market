import { useNavigate } from "react-router-dom";
import { useAuth } from "../../provider/AuthProvider";
import "./Header.scss";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";

interface HeaderProps {
  showLogout: boolean;
  setShowLogout: (value: boolean) => void;
}

function Header({ showLogout, setShowLogout }: HeaderProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const api = createLoginApiClient(auth);

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
