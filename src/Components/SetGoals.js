import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/SetGoals.css";

const SetGoals = ({ groups, setGroups }) => {
  const { userId, groupId, goalIndex } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState({
    id: null,
    title: "",
    description: "",
    dueDate: new Date(),
  });

  useEffect(() => {
    if (goalIndex !== undefined) {
      const foundGroup = groups.find((group) => group.id === parseInt(groupId));
      if (foundGroup && foundGroup.goals) {
        const foundGoal = foundGroup.goals[parseInt(goalIndex)];
        if (foundGoal) {
          setGoal({
            ...foundGoal,
            dueDate: new Date(foundGoal.dueDate), // Ensure dueDate is a Date object
          });
        }
      }
    }
  }, [groups, groupId, goalIndex]);

  const handleChange = (field, value) => {
    setGoal({ ...goal, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );
    if (!updatedGroups[groupIndex].goals) {
      updatedGroups[groupIndex].goals = [];
    }
    if (goal.id) {
      updatedGroups[groupIndex].goals = updatedGroups[groupIndex].goals.map(
        (g, idx) => (idx === parseInt(goalIndex) ? goal : g)
      );

      // Update the corresponding event
      const eventIndex = updatedGroups[groupIndex].events.findIndex(
        (event) => event.id === goal.id
      );
      if (eventIndex !== -1) {
        updatedGroups[groupIndex].events[eventIndex] = {
          ...updatedGroups[groupIndex].events[eventIndex],
          title: goal.title,
          description: goal.description,
          endDate: new Date(goal.dueDate),
        };
      }
    } else {
      const newGoalId = new Date().getTime();
      const newGoal = { ...goal, id: newGoalId };
      updatedGroups[groupIndex].goals.push(newGoal);

      const newEvent = {
        id: newGoalId,
        title: newGoal.title,
        description: newGoal.description,
        startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        endDate: new Date(newGoal.dueDate),
        color: "#ff0000",
      };

      if (!updatedGroups[groupIndex].events) {
        updatedGroups[groupIndex].events = [];
      }
      updatedGroups[groupIndex].events.push(newEvent);
    }

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    navigate(`/study-home/${userId}/${groupId}/goals`);
  };

  return (
    <div className="set-goals">
      <h2>{goalIndex !== undefined ? "Edit Goal" : "Set Goal"}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={goal.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={goal.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows="4"
            required
          ></textarea>
        </label>
        <label>
          Due Date:
          <input
            type="date"
            name="dueDate"
            value={goal.dueDate.toISOString().split("T")[0]}
            onChange={(e) => handleChange("dueDate", new Date(e.target.value))}
            required
          />
        </label>
        <button type="submit">
          {goalIndex !== undefined ? "Save Changes" : "Set Goal"}
        </button>
      </form>
    </div>
  );
};

export default SetGoals;
