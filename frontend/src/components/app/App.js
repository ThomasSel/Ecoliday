import React, { useState } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import SignUpForm from "../signUp/signUpForm";
import HomePage from "../homepage/homepage";
import LoginForm from "../login/loginForm";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage navigate={useNavigate()} />} />
      <Route path="/signup" element={<SignUpForm navigate={useNavigate()} />} />
      <Route path="/login" element={<LoginForm navigate={useNavigate()} />} />
    </Routes>
  );
};

export default App;
