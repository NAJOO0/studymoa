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

  useEffect(() => {
    const foundGroup = groups.find((group) => group.id === parseInt(groupId));
    setGroup(foundGroup);
    if (foundGroup && foundGroup.goals) {
      setGoal(foundGroup.goals[parseInt(goalIndex)]);
    }
  }, [groups, groupId, goalIndex]);

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
      status: "pending",
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
    ].status = "approved";

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
    ].status = "rejected";
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
        )} has been removed from the group due to exceeding penalties.`
      );

      // If the leader is removed, assign a new leader
      if (rejectedUserId === updatedGroups[groupIndex].leaderId) {
        if (updatedGroups[groupIndex].members.length > 0) {
          updatedGroups[groupIndex].leaderId =
            updatedGroups[groupIndex].members[0]; // Assign the first member as the new leader
          alert(
            `The new leader is ${getMemberName(
              updatedGroups[groupIndex].leaderId
            )}.`
          );
        } else {
          updatedGroups[groupIndex].leaderId = null; // No members left to assign as leader
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

    // 관련 이벤트 삭제
    updatedGroups[groupIndex].events = updatedGroups[groupIndex].events.filter(
      (event) => event.id !== goalToDelete.id
    );

    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
    navigate(`/study-home/${userId}/${groupId}/goals`);
  };

  const getMemberName = (memberId) => {
    const profile = localStorage.getItem(`profile_${memberId}`);
    return profile ? JSON.parse(profile).name : "Unknown";
  };

  if (!group || !goal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="goal-detail">
      <div className="buttons">
        <Link to={`/study-home/${userId}/${groupId}`}>
          <button className="back-home-button">Back to Study Home</button>
        </Link>
      </div>
      <h2>Goal Detail</h2>
      <h3>{goal.title}</h3>
      <p>Due Date: {new Date(goal.dueDate).toLocaleDateString()}</p>
      <p>Description: {goal.description}</p>
      <h3>Submissions</h3>
      <ul className="submissions-list">
        {(goal.submissions || []).map((submission, index) => (
          <li key={index}>
            <p>
              <strong>{getMemberName(submission.userId)}</strong>
            </p>
            <p>{submission.text}</p>
            {submission.file && (
              <p>
                <a href={URL.createObjectURL(submission.file)} download>
                  Download File
                </a>
              </p>
            )}
            <p>Status: {submission.status}</p>
            {group.leaderId === parseInt(userId) &&
              submission.status === "pending" && (
                <div>
                  <button onClick={() => handleApprove(index)}>Approve</button>
                  <button onClick={() => handleReject(index)}>Reject</button>
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
          placeholder="Enter your completion text"
          value={submission}
          onChange={handleSubmissionChange}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {group.leaderId === parseInt(userId) && (
        <div className="leader-buttons">
          <button
            onClick={() =>
              navigate(
                `/study-home/${userId}/${groupId}/edit-goal/${goalIndex}`
              )
            }
          >
            Edit Goal
          </button>
          <button onClick={handleGoalDelete}>Delete Goal</button>
        </div>
      )}
    </div>
  );
};

export default GoalDetail;
