import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../styles/UserList.css";

const UserList = ({ groups, setGroups }) => {
  const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const userList = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("profile_")) {
        const profile = JSON.parse(localStorage.getItem(key));
        if (
          profile.id !== parseInt(userId) && // 현재 사용자의 프로필을 제외
          (profile.visibility === "public" ||
            (profile.visibility === "study-members" &&
              checkStudyMember(profile.id)))
        ) {
          userList.push(profile);
        }
      }
    }
    setUsers(userList);
  }, [userId]);

  const checkStudyMember = (profileId) => {
    return groups.some(
      (group) =>
        (group.members.includes(parseInt(profileId)) ||
          group.applicants.includes(parseInt(profileId))) &&
        group.members.includes(parseInt(userId))
    );
  };

  const isAlreadyInGroup = (profileId) => {
    if (!selectedGroup) return false;
    const group = groups.find((group) => group.id === selectedGroup.value);
    if (group) {
      return (
        group.members.includes(parseInt(profileId)) ||
        group.applicants.includes(parseInt(profileId)) ||
        (group.invited && group.invited.includes(parseInt(profileId)))
      );
    }
    return false;
  };

  const handleProfileClick = (viewUserId) => {
    navigate(`/profile/${userId}/view/${viewUserId}`);
  };

  const handleInvite = (profileId) => {
    if (!selectedGroup) {
      alert("초대할 스터디를 선택하세요.");
      return;
    }
    const groupIndex = groups.findIndex(
      (group) => group.id === selectedGroup.value
    );
    const group = { ...groups[groupIndex] };

    if (group.members.length >= group.maxMembers) {
      alert("인원이 가득 찼습니다.");
      return;
    }
    if (!group.invited) {
      group.invited = [];
    }
    if (!group.invited.includes(parseInt(profileId))) {
      group.invited.push(parseInt(profileId));
      const updatedGroups = [...groups];
      updatedGroups[groupIndex] = group;
      setGroups(updatedGroups);
      localStorage.setItem("studyGroups", JSON.stringify(updatedGroups));
      alert("초대가 완료되었습니다.");
    } else {
      alert("이미 초대한 유저입니다.");
    }
  };

  const getFilteredUsers = () => {
    return users.filter((user) => {
      return !isAlreadyInGroup(user.id);
    });
  };

  const leaderGroups = groups.filter(
    (group) => group.leaderId === parseInt(userId)
  );

  return (
    <div className="user-list">
      <h2>유저 목록</h2>
      <Select
        className="select"
        options={leaderGroups.map((group) => ({
          value: group.id,
          label: group.title,
        }))}
        value={selectedGroup}
        onChange={setSelectedGroup}
        placeholder="초대할 스터디를 선택하세요."
      />
      <ul>
        {getFilteredUsers().map((user) => (
          <li key={user.id}>
            <h3 onClick={() => handleProfileClick(user.id)}>{user.name}</h3>
            <p>{user.bio}</p>
            <button onClick={() => handleInvite(user.id)}>
              스터디에 초대하기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
