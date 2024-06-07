import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/GoalList.css";

const GoalList = ({ groups }) => {
  const { userId, groupId } = useParams();
  const group = groups.find((group) => group.id === parseInt(groupId));
  const goals = group?.goals || [];

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="goal-list">
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}`}>
          <button className="back-home-button">Back to Study Home</button>
        </Link>
      </div>
      <h2>Goals for {group.title}</h2>
      <ul>
        {goals.length === 0 ? (
          <p>No goals available.</p>
        ) : (
          goals
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((goal, index) => (
              <li key={index}>
                <Link
                  to={`/study-home/${userId}/${groupId}/goal-detail/${index}`}
                >
                  <h3>{goal.title}</h3>
                  <p>Due Date: {new Date(goal.dueDate).toLocaleDateString()}</p>
                  <p>Description: {goal.description}</p>
                  <p>Completion Criteria: {goal.completionCriteria}</p>
                </Link>
              </li>
            ))
        )}
      </ul>
      {group.leaderId === parseInt(userId) && (
        <div className="buttons">
          <Link to={`/study-home/${userId}/${groupId}/set-goals`}>
            <button className="set-goal-button">Set Goal</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GoalList;
