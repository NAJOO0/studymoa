import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/GoalDetail.css";

const GoalDetail = ({ groups, setGroups }) => {
  const { userId, groupId, goalIndex } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [goal, setGoal] = useState(null);
  const [submission, setSubmission] = useState("");
  const [file, setFile] = useState(null);
  const [penalizedMembers, setPenalizedMembers] = useState([]);

  useEffect(() => {
    const foundGroup = groups.find((group) => group.id === parseInt(groupId));
    setGroup(foundGroup);
    if (foundGroup && foundGroup.goals) {
      setGoal(foundGroup.goals[parseInt(goalIndex)]);
    }
  }, [groups, groupId, goalIndex]);

  useEffect(() => {
    const penalizedData = localStorage.getItem(
      `penalized_${groupId}_${goalIndex}`
    );
    if (penalizedData) {
      setPenalizedMembers(JSON.parse(penalizedData));
    }
  }, [groupId, goalIndex]);

  const handleSubmissionChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmission = () => {
    const newSubmission = {
      userId: parseInt(userId),
      text: submission,
      file: file,
      status: "대기중",
    };

    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );
    const goalIndex = updatedGroups[groupIndex].goals.findIndex(
      (g) => g === goal
    );

    updatedGroups[groupIndex].goals[goalIndex].submissions = [
      ...(updatedGroups[groupIndex].goals[goalIndex].submissions || []),
      newSubmission,
    ];

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    setSubmission("");
    setFile(null);
  };

  const handleApprove = (submissionIndex) => {
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );
    const goalIndex = updatedGroups[groupIndex].goals.findIndex(
      (g) => g === goal
    );

    updatedGroups[groupIndex].goals[goalIndex].submissions[
      submissionIndex
    ].status = "승인";

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const handleReject = (submissionIndex) => {
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );
    const goalIndex = updatedGroups[groupIndex].goals.findIndex(
      (g) => g === goal
    );
    const rejectedUserId =
      updatedGroups[groupIndex].goals[goalIndex].submissions[submissionIndex]
        .userId;

    updatedGroups[groupIndex].goals[goalIndex].submissions[
      submissionIndex
    ].status = "미승인";
    updatedGroups[groupIndex].penalties = [
      ...(updatedGroups[groupIndex].penalties || []),
      rejectedUserId,
    ];

    // Check if user penalties exceed withdrawal condition
    const userPenalties = updatedGroups[groupIndex].penalties.filter(
      (id) => id === rejectedUserId
    ).length;
    if (
      userPenalties >= parseInt(updatedGroups[groupIndex].withdrawalCondition)
    ) {
      updatedGroups[groupIndex].members = updatedGroups[
        groupIndex
      ].members.filter((id) => id !== rejectedUserId);
      updatedGroups[groupIndex].penalties = updatedGroups[
        groupIndex
      ].penalties.filter((id) => id !== rejectedUserId);
      alert(
        `${getMemberName(
          rejectedUserId
        )}님이 스터디 탈퇴 조건을 달성해서 자동으로 탈퇴됩니다.`
      );

      // If the leader is removed, assign a new leader
      if (rejectedUserId === updatedGroups[groupIndex].leaderId) {
        if (updatedGroups[groupIndex].members.length > 0) {
          updatedGroups[groupIndex].leaderId =
            updatedGroups[groupIndex].members[0]; // Assign the first member as the new leader
          alert(
            `새로운 스터디장 ${getMemberName(
              updatedGroups[groupIndex].leaderId
            )}.`
          );
        } else {
          // No members left, delete the group
          updatedGroups.splice(groupIndex, 1);
          localStorage.removeItem(`penalized_${groupId}_${goalIndex}`);
          setGroups(updatedGroups);
          localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
          alert("스터디에 남아있는 멤버가 없어 스터디가 삭제됩니다.");
          navigate(`/my-study-groups/${userId}`);
          return;
        }
      }
    }

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const handleGoalDelete = () => {
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );
    const goalToDelete = updatedGroups[groupIndex].goals[parseInt(goalIndex)];

    updatedGroups[groupIndex].goals = updatedGroups[groupIndex].goals.filter(
      (goal) => goal.id !== goalToDelete.id
    );

    // Delete related events
    updatedGroups[groupIndex].events = updatedGroups[groupIndex].events.filter(
      (event) => event.id !== goalToDelete.id
    );

    // Delete penalized data
    localStorage.removeItem(`penalized_${groupId}_${goalIndex}`);

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    navigate(`/study-home/${userId}/${groupId}/goals`);
  };

  const handlePenalizeUnsubmittedMember = (memberId) => {
    const updatedGroups = [...groups];
    const groupIndex = updatedGroups.findIndex(
      (group) => group.id === parseInt(groupId)
    );

    updatedGroups[groupIndex].penalties = [
      ...(updatedGroups[groupIndex].penalties || []),
      memberId,
    ];

    const userPenalties = updatedGroups[groupIndex].penalties.filter(
      (id) => id === memberId
    ).length;
    if (
      userPenalties >= parseInt(updatedGroups[groupIndex].withdrawalCondition)
    ) {
      updatedGroups[groupIndex].members = updatedGroups[
        groupIndex
      ].members.filter((id) => id !== memberId);
      updatedGroups[groupIndex].penalties = updatedGroups[
        groupIndex
      ].penalties.filter((id) => id !== memberId);
      alert(
        `${getMemberName(
          memberId
        )}님이 스터디 탈퇴 조건을 달성해서 자동으로 탈퇴됩니다.`
      );

      // If the leader is removed, assign a new leader
      if (memberId === updatedGroups[groupIndex].leaderId) {
        if (updatedGroups[groupIndex].members.length > 0) {
          updatedGroups[groupIndex].leaderId =
            updatedGroups[groupIndex].members[0]; // Assign the first member as the new leader
          alert(
            `새로운 스터디장 ${getMemberName(
              updatedGroups[groupIndex].leaderId
            )}.`
          );
        } else {
          // No members left, delete the group
          updatedGroups.splice(groupIndex, 1);
          localStorage.removeItem(`penalized_${groupId}_${goalIndex}`);
          setGroups(updatedGroups);
          localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
          alert("스터디에 남아있는 멤버가 없어 스터디가 삭제됩니다.");
          navigate(`/my-study-groups/${userId}`);
          return;
        }
      }
    }

    const updatedPenalizedMembers = [...penalizedMembers, memberId];
    setPenalizedMembers(updatedPenalizedMembers);
    localStorage.setItem(
      `penalized_${groupId}_${goalIndex}`,
      JSON.stringify(updatedPenalizedMembers)
    );
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const getMemberName = (memberId) => {
    const profile = localStorage.getItem(`profile_${memberId}`);
    return profile ? JSON.parse(profile).name : "Unknown";
  };

  if (!group || !goal) {
    return <div>Loading...</div>;
  }

  const unsubmittedMembers = group.members.filter(
    (memberId) =>
      !goal.submissions?.some((submission) => submission.userId === memberId)
  );

  return (
    <div className="goal-detail">
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}`}>
          <button className="back-home-button">스터디 홈으로</button>
        </Link>
      </div>
      <h2>목표 상세페이지</h2>
      <h3>{goal.title}</h3>
      <p>마감 기한 : {new Date(goal.dueDate).toLocaleDateString()}</p>
      <p>설명 : {goal.description}</p>

      {group.leaderId === parseInt(userId) && (
        <>
          <h3>미제출 멤버</h3>
          <ul className="unsubmitted-members-list">
            {unsubmittedMembers.map((memberId) => (
              <li key={memberId}>
                {getMemberName(memberId)}
                {penalizedMembers.includes(memberId) ? (
                  <span>미제출 처리 완료</span>
                ) : (
                  <button
                    onClick={() => handlePenalizeUnsubmittedMember(memberId)}
                  >
                    미제출
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>제출물</h3>
      <ul className="submissions-list">
        {(goal.submissions || []).map((submission, index) => (
          <li key={index} className="submission">
            <p>
              <strong>{getMemberName(submission.userId)}</strong>
            </p>
            <p>{submission.text}</p>
            {submission.file && (
              <p>
                <a href={URL.createObjectURL(submission.file)} download>
                  다운로드
                </a>
              </p>
            )}
            <p>처리 상태 : {submission.status}</p>
            {group.leaderId === parseInt(userId) &&
              submission.status === "대기중" && (
                <div className="submission-actions">
                  <button onClick={() => handleApprove(index)}>승인</button>
                  <button onClick={() => handleReject(index)}>미승인</button>
                </div>
              )}
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmission();
        }}
      >
        <textarea
          placeholder="제출물 설명 입력란."
          value={submission}
          onChange={handleSubmissionChange}
        />
        <div className="form-row">
          <input type="file" onChange={handleFileChange} />
          <button type="submit">제출</button>
        </div>
      </form>
      {group.leaderId === parseInt(userId) && (
        <div className="goal-actions">
          <button
            onClick={() =>
              navigate(
                `/study-home/${userId}/${groupId}/edit-goal/${goalIndex}`
              )
            }
          >
            목표 수정
          </button>
          <button onClick={handleGoalDelete}>목표 삭제</button>
        </div>
      )}
    </div>
  );
};

export default GoalDetail;
