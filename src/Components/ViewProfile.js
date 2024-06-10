import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/ViewProfile.css";

const ViewProfile = () => {
  const { userId, viewUserId } = useParams();
  const [profile, setProfile] = useState(null);
  const [visibility, setVisibility] = useState("");

  useEffect(() => {
    const storedProfile = localStorage.getItem(`profile_${viewUserId}`);
    if (storedProfile) {
      const profileData = JSON.parse(storedProfile);
      setProfile(profileData);
      setVisibility(profileData.visibility);
    } else {
      setProfile(null);
    }
  }, [viewUserId]);

  const checkStudyMember = () => {
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      return groups.some(
        (group) =>
          (group.members.includes(parseInt(viewUserId)) ||
            group.applicants.includes(parseInt(viewUserId))) &&
          group.members.includes(parseInt(userId))
      );
    }
    return false;
  };

  if (!profile) {
    return <div>프로필을 찾을 수 없습니다.</div>;
  }

  if (visibility === "private" && parseInt(userId) !== parseInt(viewUserId)) {
    return <div>비공개 유저입니다.</div>;
  }

  if (
    visibility === "study-members" &&
    !checkStudyMember() &&
    parseInt(userId) !== parseInt(viewUserId)
  ) {
    return <div>비공개 유저입니다.</div>;
  }

  return (
    <div className="view-profile">
      <h2>{profile.name}의 프로필</h2>
      <p>
        <strong>전화번호:</strong> {profile.phone}
      </p>
      <p>
        <strong>이메일:</strong> {profile.email}
      </p>
      <p>
        <strong>설명:</strong> {profile.bio}
      </p>
      <p>
        <strong>관심 분야:</strong>{" "}
        {profile.interests.map((interest) => interest.label).join(", ")}
      </p>
      <p>
        <strong>기술 스택:</strong>{" "}
        {profile.skills.map((skill) => skill.label).join(", ")}
      </p>
    </div>
  );
};

export default ViewProfile;
