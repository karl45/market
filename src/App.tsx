import { useEffect, useState } from "react";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { BrowserRouter} from "react-router-dom";
import { useAuth } from "./provider/AuthProvider";

function App() {
  const [showLogout, setShowLogout] = useState(false);
  const { isAuth } = useAuth();
  
  useEffect(() => {
    if(isAuth){
      setShowLogout(true)
    }
    else{
      setShowLogout(false)
    }
  }, [isAuth])

  return (
    <>
      <BrowserRouter>
        <Header setShowLogout={setShowLogout} showLogout={showLogout}></Header>
        <Main setShowLogout={setShowLogout}></Main>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
