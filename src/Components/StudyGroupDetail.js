import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/StudyGroupDetail.css";

const StudyGroupDetail = ({
  groups,
  setGroups,
  onAccept,
  onReject,
  onDelete,
}) => {
  const { userId, id } = useParams();
  const navigate = useNavigate();
  const group = groups.find((group) => group.id === parseInt(id));

  if (!group) {
    return <div>Group not found</div>;
  }

  const isLeader = group.leaderId === parseInt(userId);
  const isApplicant = group.applicants.includes(parseInt(userId));
  const isMember = group.members.includes(parseInt(userId));

  const handleApply = () => {
    if (!isApplicant) {
      const updatedGroup = {
        ...group,
        applicants: [...group.applicants, parseInt(userId)],
      };
      const updatedGroups = groups.map((g) =>
        g.id === group.id ? updatedGroup : g
      );
      setGroups(updatedGroups);
    }
  };

  const handleCancelApply = () => {
    if (isApplicant) {
      const updatedGroup = {
        ...group,
        applicants: group.applicants.filter(
          (applicant) => applicant !== parseInt(userId)
        ),
      };
      const updatedGroups = groups.map((g) =>
        g.id === group.id ? updatedGroup : g
      );
      setGroups(updatedGroups);
    }
  };

  const handleLikeClick = () => {
    const updatedGroup = {
      ...group,
      likes: group.likes?.includes(parseInt(userId))
        ? group.likes.filter((id) => id !== parseInt(userId))
        : [...(group.likes || []), parseInt(userId)],
    };
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const handleAccept = (groupId, applicantId) => {
    if (group.members.length >= group.maxMembers) {
      alert("The group is already full.");
      return;
    }
    onAccept(groupId, applicantId);
  };

  const handleAcceptInvite = (invitedId) => {
    if (group.members.length >= group.maxMembers) {
      alert("The group is already full.");
      return;
    }
    const updatedGroup = {
      ...group,
      members: [...group.members, invitedId],
      invited: group.invited.filter((id) => id !== invitedId),
    };
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
  };

  const handleRejectInvite = (invitedId) => {
    const updatedGroup = {
      ...group,
      invited: group.invited.filter((id) => id !== invitedId),
    };
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
  };

  const getMemberName = (id) => {
    const profile = localStorage.getItem(`profile_${id}`);
    return profile ? JSON.parse(profile).name : "Unknown";
  };

  const handleProfileClick = (memberId) => {
    navigate(`/profile/${userId}/view/${memberId}`);
  };

  return (
    <div className="study-group-detail">
      <h2 className="center-text">Study Group Detail</h2>
      <h3>{group.title}</h3>
      <p>{group.description}</p>
      <h4>
        Members ({group.members.length}/{group.maxMembers}):
      </h4>
      <ul>
        {group.members.map((memberId, index) => (
          <li key={index}>
            <button
              className="member-button"
              onClick={() => handleProfileClick(memberId)}
            >
              {getMemberName(memberId)}
            </button>
          </li>
        ))}
      </ul>
      <h4>Applicants:</h4>
      <ul>
        {group.applicants.map((applicantId, index) => (
          <li key={index}>
            <button
              className="member-button"
              onClick={() => handleProfileClick(applicantId)}
            >
              {getMemberName(applicantId)}
            </button>
            {isLeader && (
              <>
                <button onClick={() => handleAccept(group.id, applicantId)}>
                  Accept
                </button>
                <button onClick={() => onReject(group.id, applicantId)}>
                  Reject
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h4>Invited Users:</h4>
      <ul>
        {group.invited &&
          group.invited.map((invitedId, index) => (
            <li key={index}>
              <button
                className="member-button"
                onClick={() => handleProfileClick(invitedId)}
              >
                {getMemberName(invitedId)}
              </button>
              {invitedId === parseInt(userId) && (
                <>
                  <button onClick={() => handleAcceptInvite(invitedId)}>
                    Accept
                  </button>
                  <button onClick={() => handleRejectInvite(invitedId)}>
                    Reject
                  </button>
                </>
              )}
            </li>
          ))}
      </ul>
      <div className="detail-buttons">
        {isMember || isLeader ? (
          <Link to={`/study-home/${userId}/${group.id}`}>
            <button className="group-home-button centered-button">
              Study Home
            </button>
          </Link>
        ) : isApplicant ? (
          <button
            onClick={handleCancelApply}
            className="apply-button centered-button"
          >
            Cancel Apply
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="apply-button centered-button"
          >
            Apply to Join
          </button>
        )}
        {isLeader && (
          <>
            <button
              className="edit-delete-button"
              onClick={() =>
                navigate(`/study-group/${userId}/edit/${group.id}`)
              }
            >
              Edit Group
            </button>
            <button
              className="edit-delete-button"
              onClick={() => onDelete(group.id)}
            >
              Delete Group
            </button>
          </>
        )}
      </div>
      <div className="like-section" onClick={handleLikeClick}>
        {group.likes?.includes(parseInt(userId)) ? (
          <FaHeart color="red" />
        ) : (
          <FaRegHeart />
        )}
        <span className="like-count">{group.likes?.length || 0}</span>
      </div>
    </div>
  );
};

export default StudyGroupDetail;
