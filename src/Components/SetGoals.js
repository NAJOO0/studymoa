import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/SetGoals.css";

const SetGoals = ({ groups, setGroups }) => {
  const { userId, groupId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState({
    title: "",
    dueDate: new Date(),
    description: "",
    completionCriteria: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal((prevGoal) => ({
      ...prevGoal,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setGoal((prevGoal) => ({
      ...prevGoal,
      dueDate: date,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );
    updatedGroups[groupIndex].goals = [
      ...(updatedGroups[groupIndex].goals || []),
      goal,
    ];
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    navigate(`/study-home/${userId}/${groupId}`);
  };

  return (
    <div className="set-goals">
      <h2>Set Goal</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={goal.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Due Date:
          <DatePicker
            selected={goal.dueDate}
            onChange={handleDateChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={goal.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Completion Criteria:
          <textarea
            name="completionCriteria"
            value={goal.completionCriteria}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <button type="submit">Set Goal</button>
      </form>
    </div>
  );
};

export default SetGoals;
