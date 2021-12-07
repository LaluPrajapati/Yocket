import React, { useEffect, useState } from "react";
import Login from "../Login";
import Task from "../TaskList";

import "./common.scss";

const Main = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [headers, setHeaders] = useState({
  //   "Content-Type": "application/json",
  //   Authorization: "",
  // });

  const handleAuth = (token) => {
    localStorage.setItem("authToken", token);
    //handleHeaders(token);
    setLoggedIn(true);
  };

  // const handleHeaders = (token) => {
  //   const updatedHeader = headers;
  //   setHeaders({ ...updatedHeader, Authorization: `Bearer ${token}` });
  // };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  return (
    <div className="tm-container">
      {!loggedIn ? (
        <Login handleAuth={handleAuth} />
      ) : (
        <Task setIsLoggedin={setLoggedIn} />
      )}
    </div>
  );
};

export default Main;
