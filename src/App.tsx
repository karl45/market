import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";
import { useLoad } from "./provider/LoadingProvider";

function App() {
  const [showLogout, setShowLogout] = useState(false);
  const auth = useAuth();
  const load = useLoad();

  useEffect(() => {
    if (auth.isAuth) {
      setShowLogout(true);
    } else {
      setShowLogout(false);
    }
  }, [auth.isAuth]);

  return (
    <>
      <BrowserRouter>
        <Header auth={auth} load={load} setShowLogout={setShowLogout} showLogout={showLogout}></Header>
        <Main auth={auth} load={load} setShowLogout={setShowLogout}></Main>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
