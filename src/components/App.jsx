import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import notesReducer from "../reducer.js";
import Account from "./Account.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import New from "./New.jsx";

const store = createStore(notesReducer);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/account/:username" element={<Account />} />
          <Route path="/new/:username" element={<New />} />
          <Route path="/" element={<SignUp />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
