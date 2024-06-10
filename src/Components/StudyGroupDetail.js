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
  onEdit,
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
      <h2 className="center-text">스터디 상세 페이지</h2>
      <h3>{group.title}</h3>
      <h4>스터디 분야 : {group.topic.label}</h4>
      <p>{group.description}</p>
      <h4>
        스터디 멤버 ({group.members.length}/{group.maxMembers})
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
      <h4>지원자</h4>
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
                  수락
                </button>
                <button onClick={() => onReject(group.id, applicantId)}>
                  거절
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <h4>초대된 유저:</h4>
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
                    수락
                  </button>
                  <button onClick={() => handleRejectInvite(invitedId)}>
                    거절
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
              스터디 홈으로
            </button>
          </Link>
        ) : isApplicant ? (
          <button
            onClick={handleCancelApply}
            className="apply-button centered-button"
          >
            스터디 지원 취소
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="apply-button centered-button"
          >
            스터디 지원
          </button>
        )}
        {isLeader && (
          <>
            <button
              className="edit-delete-button"
              onClick={() => onEdit(group)}
            >
              스터디 수정
            </button>
            <button
              className="edit-delete-button"
              onClick={() => onDelete(group.id)}
            >
              스터디 삭제
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
