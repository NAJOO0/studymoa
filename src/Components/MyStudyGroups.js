import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StudyGroupList from "./StudyGroupList";
import "../styles/MyStudyGroups.css";

const MyStudyGroups = () => {
  const { userId } = useParams();
  const [userGroups, setUserGroups] = useState([]);
  const [appliedGroups, setAppliedGroups] = useState([]);
  const [invitedGroups, setInvitedGroups] = useState([]);

  useEffect(() => {
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      const memberGroups = groups.filter((group) =>
        group.members.includes(parseInt(userId))
      );
      const applicantGroups = groups.filter((group) =>
        group.applicants.includes(parseInt(userId))
      );
      const invitedGroups = groups.filter(
        (group) => group.invited && group.invited.includes(parseInt(userId))
      );
      setUserGroups(memberGroups);
      setAppliedGroups(applicantGroups);
      setInvitedGroups(invitedGroups);
    }
  }, [userId]);

  const handleDeleteGroup = (groupId) => {
    const updatedGroups = userGroups.filter((group) => group.id !== groupId);
    setUserGroups(updatedGroups);
    const storedGroups = JSON.parse(localStorage.getItem("studyGroups"));
    const updatedStoredGroups = storedGroups.filter(
      (group) => group.id !== groupId
    );
    localStorage.setItem("studyGroups", JSON.stringify(updatedStoredGroups));
  };

  return (
    <div className="my-study-groups">
      <h2>My Study Groups</h2>
      <h3>Accepted Groups</h3>
      <StudyGroupList
        groups={userGroups}
        showStatus
        onDeleteGroup={handleDeleteGroup}
      />

      <h3>Pending Applications</h3>
      <StudyGroupList
        groups={appliedGroups}
        showStatus
        onDeleteGroup={handleDeleteGroup}
      />

      <h3>Invited Groups</h3>
      <StudyGroupList
        groups={invitedGroups}
        showStatus
        onDeleteGroup={handleDeleteGroup}
      />
    </div>
  );
};

export default MyStudyGroups;
