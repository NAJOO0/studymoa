import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/StudyHome.css";

const StudyHome = ({ groups, setGroups }) => {
  const { userId, groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const foundGroup = groups.find((group) => group.id === parseInt(groupId));
    setGroup(foundGroup);
  }, [groups, groupId]);

  if (!group) {
    return <div>Loading...</div>;
  }

  const isLeader = group.leaderId === parseInt(userId);
  const goals = group.goals || [];
  const hasGoals = goals.length > 0;

  const calculateFailedGoals = (memberId) => {
    return group.penalties
      ? group.penalties.filter((id) => id === memberId).length
      : 0;
  };

  const earliestGoal = hasGoals
    ? goals.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
    : null;

  return (
    <div className="study-home">
      <h2>Study Home: {group.title}</h2>
      <div>
        <p>Group Withdrawal Condition: {group.withdrawalCondition} failures</p>
        <ul>
          {group.members.map((memberId) => {
            const profile = localStorage.getItem(`profile_${memberId}`);
            const memberProfile = profile ? JSON.parse(profile) : null;
            return (
              <li key={memberId}>
                {memberProfile ? memberProfile.name : "Unknown"}:{" "}
                {calculateFailedGoals(memberId)} / {group.withdrawalCondition}
              </li>
            );
          })}
        </ul>
      </div>
      {earliestGoal && (
        <div
          className="earliest-goal"
          onClick={() =>
            navigate(
              `/study-home/${userId}/${groupId}/goal-detail/${goals.indexOf(
                earliestGoal
              )}`
            )
          }
        >
          <h3>Upcoming Goal</h3>
          <p>
            <strong>{earliestGoal.description}</strong>
          </p>
          <p>Due Date: {new Date(earliestGoal.dueDate).toLocaleDateString()}</p>
          <p>Criteria: {earliestGoal.criteria}</p>
          <p>Penalty: {earliestGoal.penalty}</p>
        </div>
      )}
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}/goals`}>
          <button className="view-goals-button">View Goals</button>
        </Link>
      </div>
    </div>
  );
};

export default StudyHome;
