// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Account from "./views/Account";
import Login from "./views/Login";
import "./App.css";
import { Game } from "./views/Game";
import { Navbar } from "./components/Navbar";
import { StyledFooter, StyledPage } from "./Styled";

const App = () => {
  return (
    <>
      <Navbar />
      <StyledPage>
        <BrowserRouter>
          <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/account/`} element={<Account />} />
            <Route path={`/login/`} element={<Login />} />
            <Route path={`/game`} element={<Game />} />
          </Routes>
        </BrowserRouter>
      </StyledPage>
      <StyledFooter>&copy; 2023 TONKATSU. All Rights Reserved.</StyledFooter>
    </>
  );
};

export default App;
