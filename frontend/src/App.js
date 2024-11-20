//scss
import "./assets/scss/hope-ui.scss";
import "./assets/scss/customizer.scss";

// Redux Selector / Action
import { useDispatch } from "react-redux";
import { useEffect } from "react";

// import state selectors
import { setSetting } from "./store/setting/actions";

function App({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("App mounted, setting initial state");
    dispatch(setSetting());
  }, [dispatch]);

  return <div className="App">{children}</div>;
}

export default App;
