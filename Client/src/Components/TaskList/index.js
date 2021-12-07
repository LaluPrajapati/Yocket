import React, { useState } from "react";
import Add from "./Add";
import List from "./List";

const Task = ({ setIsLoggedin }) => {
  const [isAdd, setIsAdd] = useState(false);
  const [editItem, setEditItem] = useState({});

  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("authToken"),
  };

  const handleEditTask = (selectedTask) => {
    setIsAdd(true);
    setEditItem(selectedTask);
  };

  return (
    <div className="tm-tasklist-container tm-form-container">
      {isAdd ? (
        <Add setIsAdd={setIsAdd} editData={editItem} headers={headers} />
      ) : (
        <List
          setIsAdd={setIsAdd}
          setEditItem={handleEditTask}
          headers={headers}
          setIsLoggedin={setIsLoggedin}
        />
      )}
    </div>
  );
};

export default Task;
