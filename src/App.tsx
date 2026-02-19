import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";
import { useLoad } from "./provider/LoadingProvider";

function App() {
  const [showProfileSection, setShowProfileSection] = useState(false);
  const auth = useAuth();
  const load = useLoad();

  useEffect(() => {
    if (auth.isAuth) {
      setShowProfileSection(true);
    } else {
      setShowProfileSection(false);
    }
  }, [auth.isAuth]);

  return (
    <>
      <BrowserRouter>
        <Header auth={auth} load={load} setShowProfileSection={setShowProfileSection} showProfileSection={showProfileSection}></Header>
        <Main auth={auth} load={load} setShowProfileSection={setShowProfileSection}></Main>
      </BrowserRouter>
    </>
  );
}

export default App;
