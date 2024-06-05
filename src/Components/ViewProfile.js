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
    return <div>Profile not found</div>;
  }

  if (visibility === "private" && parseInt(userId) !== parseInt(viewUserId)) {
    return <div>This profile is private.</div>;
  }

  if (
    visibility === "study-members" &&
    !checkStudyMember() &&
    parseInt(userId) !== parseInt(viewUserId)
  ) {
    return <div>This profile is private.</div>;
  }

  return (
    <div className="view-profile">
      <h2>{profile.name}'s Profile</h2>
      <p>
        <strong>Phone:</strong> {profile.phone}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio}
      </p>
      <p>
        <strong>Interests:</strong>{" "}
        {profile.interests.map((interest) => interest.label).join(", ")}
      </p>
      <p>
        <strong>Skills:</strong>{" "}
        {profile.skills.map((skill) => skill.label).join(", ")}
      </p>
    </div>
  );
};

export default ViewProfile;
