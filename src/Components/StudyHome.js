import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
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
    const penalties = group.penalties || [];
    return penalties.filter((penalty) => penalty === memberId).length;
  };

  const earliestGoal = hasGoals
    ? goals.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
    : null;

  return (
    <div className="study-home">
      <h2>Study Home: {group.title}</h2>
      <div className="withdrawal-info">
        <p>Group Withdrawal Condition: {group.withdrawalCondition} failures</p>
        <ul>
          {group.members.map((memberId) => {
            const memberProfile = JSON.parse(
              localStorage.getItem(`profile_${memberId}`)
            );
            return (
              <li key={memberId} className="member-info">
                {memberProfile.name}: {calculateFailedGoals(memberId)} /{" "}
                {group.withdrawalCondition}
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
            <strong>{earliestGoal.title}</strong>
          </p>
          <p>Due Date: {new Date(earliestGoal.dueDate).toLocaleDateString()}</p>
          <p>Description: {earliestGoal.description}</p>
        </div>
      )}
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}/goals`}>
          <button className="view-goals-button">View Goals</button>
        </Link>
        <Link to={`/study-home/${userId}/${groupId}/resources`}>
          <button className="view-resources-button">View Resources</button>
        </Link>
      </div>
      <Calendar group={group} setGroups={setGroups} />
    </div>
  );
};

export default StudyHome;
