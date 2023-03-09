import { Routes, Route, useNavigate } from "react-router-dom";
import SignUpForm from "../signUp/signUpForm";
import HomePage from "../homepage/homepage";
import LoginForm from "../login/loginForm";
import UserTrips from "../userTrips/userTrips";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage navigate={useNavigate()} />} />
      <Route path="/signup" element={<SignUpForm navigate={useNavigate()} />} />
      <Route path="/login" element={<LoginForm navigate={useNavigate()} />} />
      <Route path="/trips" element={<UserTrips navigate={useNavigate()} />} />
      <Route path="/test" element={<Test navigate={useNavigate()} />} />
    </Routes>
  );
};

const Test = ({ navigate }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        console.log("Calling navigate('/')");
        navigate("/");
        console.log("navigate('/') has been called");
      }}
      className="w-20 h-20 bg-white"
    >
      Click me!
    </button>
  );
};

export default App;
