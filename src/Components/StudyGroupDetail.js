import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/StudyGroupDetail.css";

const StudyGroupDetail = ({
  groups,
  setGroups,
  onAccept,
  onReject,
  onEdit,
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
  const isInvited = group.invited.includes(parseInt(userId));

  const handleLike = () => {
    const likedBy = group.likedBy || [];
    const isLiked = likedBy.includes(parseInt(userId));
    const updatedLikedBy = isLiked
      ? likedBy.filter((id) => id !== parseInt(userId))
      : [...likedBy, parseInt(userId)];

    const updatedGroup = { ...group, likedBy: updatedLikedBy };
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const handleApply = () => {
    if (!isApplicant) {
      const updatedGroup = {
        ...group,
        applicants: [...group.applicants, parseInt(userId)],
      };
      onEdit(updatedGroup);
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
      onEdit(updatedGroup);
    }
  };

  const handleAccept = (groupId, applicantId) => {
    if (group.members.length >= group.maxMembers) {
      alert("The group is already full.");
      return;
    }
    onAccept(groupId, applicantId);
  };

  const getMemberName = (id) => {
    const profile = localStorage.getItem(`profile_${id}`);
    return profile ? JSON.parse(profile).name : "Unknown";
  };

  const handleProfileClick = (memberId) => {
    navigate(`/profile/${userId}/view/${memberId}`);
  };

  const onAcceptInvitation = (groupId, userId) => {
    const updatedGroup = {
      ...group,
      members: [...group.members, parseInt(userId)],
      invited: group.invited.filter(
        (invitedId) => invitedId !== parseInt(userId)
      ),
    };
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  const onRejectInvitation = (groupId, userId) => {
    const updatedGroup = {
      ...group,
      invited: group.invited.filter(
        (invitedId) => invitedId !== parseInt(userId)
      ),
    };
    const updatedGroups = groups.map((g) =>
      g.id === group.id ? updatedGroup : g
    );
    setGroups(updatedGroups);
    localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
  };

  return (
    <div className="study-group-detail">
      <div className="like-section" onClick={handleLike}>
        {group.likedBy.includes(parseInt(userId)) ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )}
        <span>{group.likedBy.length}</span>
      </div>
      <h2 className="center-text">Study Group Detail</h2>
      <h3>{group.title}</h3>
      <p>{group.description}</p>
      <p>Topic: {group.topic?.label}</p>
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
              {isInvited && invitedId === parseInt(userId) && (
                <>
                  <button onClick={() => onAcceptInvitation(group.id, userId)}>
                    Accept
                  </button>
                  <button onClick={() => onRejectInvitation(group.id, userId)}>
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
              onClick={() => onEdit(group)}
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
    </div>
  );
};

export default StudyGroupDetail;
