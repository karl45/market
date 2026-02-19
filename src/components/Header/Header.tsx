import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { createLoginApiClient } from "../../apiHelper/LoginApiFetch";
import type { AuthProps, LoadProps } from "../../type/types";
import { useState } from "react";

interface HeaderProps extends LoadProps, AuthProps {
  showProfileSection: boolean;
  setShowProfileSection: (value: boolean) => void;
}

function Header({ showProfileSection, setShowProfileSection, auth, load }: HeaderProps) {
  const navigate = useNavigate();
  const api = createLoginApiClient(auth);

  const [logoutLogoUrl, setLogoutLogoUrl] = useState("https://img.icons8.com/?size=100&id=2445&format=png&color=FFFFFF");
  const useHoverOn = () => {
    setLogoutLogoUrl(
      "https://img.icons8.com/?size=100&id=8119&format=png&color=0065a2",
    );
  };

  const useHoverOff = () => {
    setLogoutLogoUrl(
      "https://img.icons8.com/?size=100&id=2445&format=png&color=FFFFFF",
    );
  };

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
          setShowProfileSection(false);
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
          {showProfileSection && (
            <button
              onMouseEnter={useHoverOn}
              onMouseLeave={useHoverOff}
              onClick={onLogout}
              className={`logout ${showProfileSection ? "fadeIn" : "fadeOut"} `}
            >
              <img src={logoutLogoUrl} alt="" />
            </button>

          )}
        </div>
      </div>
    </>
  );
}

export default Header;
