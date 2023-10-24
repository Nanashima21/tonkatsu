// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Account from "./views/Account";
import Login from "./views/Login";
import "./App.css";
import { Game } from "./views/Game";
import { StyledFooter, StyledNavbar, StyledLogo } from "./Styled";

const App = () => {
  return (
    <>
      <StyledNavbar>
        <a href="http://localhost:5173/">
          <img height="100%" src="/src/assets/title.png"></img>
        </a>
        <a>使い方</a>
      </StyledNavbar>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/account/`} element={<Account />} />
          <Route path={`/login/`} element={<Login />} />
          <Route path={`/game`} element={<Game />} />
        </Routes>
      </BrowserRouter>
      <StyledFooter>&copy; 2023 TONKATSU. All Rights Reserved.</StyledFooter>
    </>
  );
};

export default App;
