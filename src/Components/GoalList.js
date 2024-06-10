import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/GoalList.css";

const GoalList = ({ groups }) => {
  const { userId, groupId } = useParams();
  const group = groups.find((group) => group.id === parseInt(groupId));
  const goals = group ? group.goals || [] : [];

  if (!group) {
    return <div>스터디가 없습니다.</div>;
  }

  return (
    <div className="goal-list">
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}`}>
          <button className="back-home-button">스터디 홈으로</button>
        </Link>
      </div>
      <h2>목표 목록</h2>
      <ul>
        {goals.length > 0 ? (
          goals
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((goal, index) => (
              <li key={index}>
                <Link
                  to={`/study-home/${userId}/${groupId}/goal-detail/${index}`}
                >
                  <h3>{goal.title}</h3>
                  <p>
                    마감 기한 : {new Date(goal.dueDate).toLocaleDateString()}
                  </p>
                  <p>설명 : {goal.description}</p>
                </Link>
              </li>
            ))
        ) : (
          <p>아직 생성된 목표가 없습니다.</p>
        )}
      </ul>
      {group.leaderId === parseInt(userId) && (
        <div className="buttons">
          <Link to={`/study-home/${userId}/${groupId}/set-goal`}>
            <button className="set-goal-button">목표 추가</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default GoalList;
