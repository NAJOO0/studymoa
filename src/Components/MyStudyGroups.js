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

  const updateGroupsInStorage = (updatedGroups) => {
    const storedGroups = JSON.parse(localStorage.getItem("studyGroups")) || [];
    const updatedStoredGroups = storedGroups.map((group) => {
      const updatedGroup = updatedGroups.find((g) => g.id === group.id);
      return updatedGroup ? updatedGroup : group;
    });
    localStorage.setItem("studyGroups", JSON.stringify(updatedStoredGroups));
    window.location.reload();
  };

  return (
    <div className="my-study-groups">
      <h2>나의 스터디 그룹</h2>
      <h3>승인된 그룹</h3>
      <StudyGroupList
        groups={userGroups}
        setGroups={(updatedGroups) => {
          setUserGroups(updatedGroups);
          updateGroupsInStorage(updatedGroups);
        }}
        showStatus
        onDeleteGroup={handleDeleteGroup}
      />

      <h3>승인 대기중인 그룹</h3>
      <StudyGroupList
        groups={appliedGroups}
        setGroups={(updatedGroups) => {
          setAppliedGroups(updatedGroups);
          updateGroupsInStorage(updatedGroups);
        }}
        showStatus
        onDeleteGroup={handleDeleteGroup}
      />

      <h3>초대된 그룹</h3>
      <StudyGroupList
        groups={invitedGroups}
        setGroups={(updatedGroups) => {
          setInvitedGroups(updatedGroups);
          updateGroupsInStorage(updatedGroups);
        }}
        showStatus
        onDeleteGroup={handleDeleteGroup}
      />
    </div>
  );
};

export default MyStudyGroups;
