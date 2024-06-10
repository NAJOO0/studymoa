import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../styles/StudyGroupList.css";

const studyTopicsOptions = [
  { value: "all", label: "전체" },
  { value: "web-development", label: "Web Development" },
  { value: "app-development", label: "App Development" },
  { value: "ai", label: "AI" },
  { value: "nlp", label: "NLP" },
  { value: "data-science", label: "Data Science" },
  { value: "cyber-security", label: "Cyber Security" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "blockchain", label: "Blockchain" },
  { value: "iot", label: "IoT" },
  { value: "game-development", label: "Game Development" },
  { value: "ar-vr", label: "AR/VR" },
];

const sortOptions = [
  { value: "newest", label: "최신순" },
  { value: "likes", label: "좋아요 순" },
];

const StudyGroupList = ({ groups, showStatus, setGroups }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState({
    value: "all",
    label: "전체",
  });
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  const filteredGroups = groups
    .filter((group) => {
      const matchesTitle = group.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());
      const matchesTopic =
        selectedTopic.value === "all" ||
        (group.topic && group.topic.value === selectedTopic.value);
      return matchesTitle && matchesTopic;
    })
    .sort((a, b) => {
      if (selectedSort.value === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (selectedSort.value === "likes") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });

  const handleLikeClick = (groupId) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === groupId) {
        const isLiked = group.likes?.includes(parseInt(userId));
        return {
          ...group,
          likes: isLiked
            ? group.likes.filter((id) => id !== parseInt(userId))
            : [...(group.likes || []), parseInt(userId)],
        };
      }
      return group;
    });
    setGroups(updatedGroups);
    updateLocalStorageGroups(updatedGroups);
  };

  const updateLocalStorageGroups = (updatedGroups) => {
    const storedGroups = JSON.parse(localStorage.getItem("studyGroups")) || [];
    const mergedGroups = storedGroups.map(
      (storedGroup) =>
        updatedGroups.find(
          (updatedGroup) => updatedGroup.id === storedGroup.id
        ) || storedGroup
    );
    localStorage.setItem("studyGroups", JSON.stringify(mergedGroups));
  };

  return (
    <div className="study-group-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="제목으로 검색"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <Select
          options={studyTopicsOptions}
          value={selectedTopic}
          onChange={setSelectedTopic}
          placeholder="분야별 검색"
        />
        <Select
          options={sortOptions}
          value={selectedSort}
          onChange={setSelectedSort}
          placeholder="정렬"
        />
      </div>
      {filteredGroups.length === 0 ? (
        <p>스터디가 없습니다.</p>
      ) : (
        <ul>
          {filteredGroups.map((group) => (
            <li
              key={group.id}
              onClick={() =>
                navigate(`/study-group/${userId}/detail/${group.id}`)
              }
            >
              <h3>{group.title}</h3>
              <p>{group.description}</p>
              <p>분야: {group.topic?.label}</p>
              <p>
                스터디장:
                {group.leaderName}
              </p>
              <p>
                멤버: {group.members.length}/{group.maxMembers}
              </p>
              <p>지원자: {group.applicants.length}명</p>
              {showStatus &&
                (group.leaderId === parseInt(userId) ? (
                  <p>직위: 스터디장</p>
                ) : group.members &&
                  group.members.includes(parseInt(userId)) ? (
                  <p>직위: 멤버</p>
                ) : (
                  <p>상태: 승인 대기중</p>
                ))}
              <div
                className="like-section"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the navigate event
                  handleLikeClick(group.id);
                }}
              >
                {group.likes?.includes(parseInt(userId)) ? (
                  <FaHeart className="like-icon liked" />
                ) : (
                  <FaRegHeart className="like-icon" />
                )}
                <span className="like-count">{group.likes?.length || 0}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudyGroupList;
