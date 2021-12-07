import React, { useState, useEffect } from "react";
import NoDataAvailable from "../NoDataAvailable";
import axios from "axios";
import "./style.scss";

const List = ({ setIsAdd, setEditItem, headers, setIsLoggedin }) => {
  const [taskList, setTaskList] = useState({});
  const [sortBy, setSortBy] = useState("");

  const addNewTask = () => {
    setEditItem({});
    setIsAdd(true);
  };
  const deleteTask = (_id) => {
    axios
      .delete(`/tasks/${_id}`, { headers })
      .then(function (res) {
        const updatedList = taskList.filter(
          (task) => task._id !== res.data._id
        );
        setTaskList(updatedList);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleEdit = (task) => {
    setEditItem(task);
  };

  const handleCompletd = (item) => {
    const payload = {
      name: item.name,
      completed: !item.completed,
      priority: item.priority,
      deadline: item.deadline,
    };
    axios
      .patch(`/tasks/${item._id}`, payload, { headers })
      .then(function (res) {
        const updatedList = taskList.map(
          (obj) => [res.data].find((o) => o._id === obj._id) || obj
        );
        setTaskList(updatedList);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTaskList = () => {
    let url = "/tasks";
    if (sortBy.length) {
      url = `/tasks?sortBy=${sortBy}`;
    }
    axios
      .get(url, { headers })
      .then(function (res) {
        console.log(res);
        setTaskList(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getTaskList();
  }, [sortBy]);

  const handleLogOut = () => {
    axios
      .post("/users/logout", {}, { headers })
      .then(function (res) {
        localStorage.clear();
        setIsLoggedin(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <div className="mb-10">
        <button className="mr-5" onClick={() => setSortBy("")}>
          All
        </button>
        <button className="mr-5" onClick={() => setSortBy("today")}>
          Todays
        </button>
        <button className="mr-5" onClick={() => setSortBy("overdue")}>
          Overdues
        </button>
        <button onClick={() => setSortBy("upcoming")}>Upcoming</button>
      </div>
      <div className="tm-form-field p-0">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Completed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taskList && taskList.length ? (
              taskList.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>{index + 1}.</td>
                    <td>{item.name}</td>
                    <td className="text-center">
                      <input
                        type="checkbox"
                        onChange={() => handleCompletd(item)}
                        checked={item.completed}
                      />
                    </td>
                    <td>
                      <span
                        className="edit action-button"
                        onClick={() => handleEdit(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 0 24 24"
                          width="18px"
                          fill="#000000"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                        </svg>
                      </span>
                      <span
                        className="delete action-button"
                        onClick={() => deleteTask(item._id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18px"
                          viewBox="0 0 24 24"
                          width="18px"
                          fill="#000000"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4">
                  <NoDataAvailable />
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-right">
                <button onClick={addNewTask}>New Task</button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="text-right">
        <button className="mt-10" onClick={handleLogOut}>
          Logout
        </button>
      </div>
    </>
  );
};

export default List;
