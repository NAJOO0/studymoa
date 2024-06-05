import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../styles/UserList.css";

const UserList = () => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const userList = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("profile_")) {
        const profile = JSON.parse(localStorage.getItem(key));
        if (
          profile.visibility === "public" ||
          (profile.visibility === "study-members" &&
            checkStudyMember(profile.id))
        ) {
          userList.push(profile);
        }
      }
    }
    setUsers(userList);

    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const userGroups = JSON.parse(storedGroups).filter(
        (group) => group.leaderId === parseInt(userId)
      );
      setGroups(
        userGroups.map((group) => ({ value: group.id, label: group.title }))
      );
    }
  }, [userId]);

  const checkStudyMember = (profileId) => {
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      return groups.some(
        (group) =>
          (group.members.includes(parseInt(profileId)) ||
            group.applicants.includes(parseInt(profileId))) &&
          group.members.includes(parseInt(userId))
      );
    }
    return false;
  };

  const isAlreadyInGroup = (profileId) => {
    if (!selectedGroup) return false;
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      const group = groups.find((group) => group.id === selectedGroup.value);
      if (group) {
        return (
          group.members.includes(profileId) ||
          group.applicants.includes(profileId) ||
          (group.invited && group.invited.includes(profileId))
        );
      }
    }
    return false;
  };

  const handleProfileClick = (viewUserId) => {
    navigate(`/profile/${userId}/view/${viewUserId}`);
  };

  const handleInvite = (profileId) => {
    if (!selectedGroup) {
      alert("Please select a group to invite the user to.");
      return;
    }
    const storedGroups = localStorage.getItem("studyGroups");
    if (storedGroups) {
      const groups = JSON.parse(storedGroups);
      const group = groups.find((group) => group.id === selectedGroup.value);
      if (group.members.length >= group.maxMembers) {
        alert("The group is already full.");
        return;
      }
      if (!group.invited) {
        group.invited = [];
      }
      if (!group.invited.includes(profileId)) {
        group.invited.push(profileId);
        localStorage.setItem("studyGroups", JSON.stringify(groups));
        alert("User invited successfully!");
      } else {
        alert("User is already invited.");
      }
    }
  };

  const getFilteredUsers = () => {
    return users.filter((user) => {
      return !isAlreadyInGroup(user.id);
    });
  };

  return (
    <div className="user-list">
      <h2>User Profiles</h2>
      <Select
        options={groups}
        value={selectedGroup}
        onChange={setSelectedGroup}
        placeholder="Select a group to invite to"
      />
      <ul>
        {getFilteredUsers().map((user) => (
          <li key={user.id}>
            <h3 onClick={() => handleProfileClick(user.id)}>{user.name}</h3>
            <p>{user.bio}</p>
            <button onClick={() => handleInvite(user.id)}>
              Invite to Group
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
