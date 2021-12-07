import React, { useState, useEffect } from "react";
import axios from "axios";
const Add = ({ setIsAdd, editData, headers }) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("");
  const [priorityVal, setPriorityVal] = useState("");
  const defaultDate = new Date();
  const [deadline, setDeadline] = useState(defaultDate.toLocaleDateString());

  const createTask = async (e) => {
    const newTask = {
      name,
      priority,
      priorityVal,
      deadline,
    };
    if (e.target.innerText === "Update") {
      axios
        .patch(`/tasks/${editData._id}`, newTask, { headers })
        .then(function (res) {
          setIsAdd(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      axios
        .post("/tasks", newTask, { headers })
        .then(function (response) {
          console.log(response);
          setIsAdd(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (Object.keys(editData).length) {
      setName(editData?.name);
      setPriority(editData.priority);
      setPriorityVal(editData.priorityVal);
      setDeadline(editData?.deadline.split("T")[0]);
    }
  }, []);

  return (
    <div className="tm-add-edit-task">
      <h3 className="tm-form-title">Add Task</h3>
      <div className="tm-form-field">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <select
          value={priority}
          onChange={(e, i) => {
            setPriority(e.target.value);
            setPriorityVal(e.target.selectedOptions[0].innerText);
          }}
        >
          <option value="">Select Priority</option>
          <option value="1">High</option>
          <option value="2">Medium</option>
          <option value="3">Low</option>
        </select>
        <div>
          <label>Deadline</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
          />
        </div>
        <button onClick={(e) => createTask(e)} className="tm-button">
          {Object.keys(editData).length ? "Update" : "Create"}
        </button>
        <button onClick={() => setIsAdd(false)} className="tm-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Add;
