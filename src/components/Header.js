import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../logo.svg';

export function Header(props) {
  const location = useLocation()
  return (
    <div id="header">
      <div className="wrapper">
        <div className="nav-bar">
          <img src={logo} className="logo" alt="logo" />
          <Link className={`nav-item ${location.pathname === "/" ? "active" : ""}`} to={"/"}>Dashboard</Link>
          <Link className={`nav-item ${location.pathname === "/shifts" ? "active" : ""}`} to={"/shifts"}>Shift List</Link>
        </div>
      </div>
    </div>
  );
}